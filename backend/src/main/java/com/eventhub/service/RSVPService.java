package com.eventhub.service;

import com.eventhub.dto.RSVPResponse;
import com.eventhub.exception.BadRequestException;
import com.eventhub.exception.ResourceNotFoundException;
import com.eventhub.model.Event;
import com.eventhub.model.Notification;
import com.eventhub.model.RSVP;
import com.eventhub.model.User;
import com.eventhub.repository.EventRepository;
import com.eventhub.repository.NotificationRepository;
import com.eventhub.repository.RSVPRepository;
import com.eventhub.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RSVPService {
    
    private final RSVPRepository rsvpRepository;
    private final EventRepository eventRepository;
    private final UserRepository userRepository;
    private final NotificationRepository notificationRepository;
    private final SimpMessagingTemplate messagingTemplate;
    
    @Transactional
    public RSVPResponse createRSVP(Long eventId, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found"));
        
        Optional<RSVP> existingRSVP = rsvpRepository.findByUserIdAndEventId(user.getId(), eventId);
        if (existingRSVP.isPresent()) {
            throw new BadRequestException("You have already RSVP'd to this event");
        }
        
        // Validation: Cannot RSVP to own event
        if (event.getOrganizer().getId().equals(user.getId())) {
            throw new BadRequestException("Organizers cannot RSVP to their own events");
        }
        
        // Validation: Cannot RSVP to past events
        if (event.getEventDate().isBefore(java.time.LocalDateTime.now())) {
            throw new BadRequestException("Cannot RSVP to past events");
        }
        
        // Validation: Cannot RSVP to unpublished events
        if (!event.getPublished()) {
            throw new BadRequestException("Cannot RSVP to unpublished events");
        }
        
        // Use database count to avoid race condition with lazy loading
        Long confirmedCount = rsvpRepository.countConfirmedByEventId(eventId);
        RSVP.RSVPStatus status = confirmedCount >= event.getCapacity() ? RSVP.RSVPStatus.WAITLIST : RSVP.RSVPStatus.CONFIRMED;
        
        RSVP rsvp = RSVP.builder()
                .user(user)
                .event(event)
                .status(status)
                .build();
        
        rsvp = rsvpRepository.save(rsvp);
        
        // Create notification for organizer
        String message = user.getFirstName() + " " + user.getLastName() + 
                        " has " + (status == RSVP.RSVPStatus.CONFIRMED ? "confirmed" : "joined waitlist for") + 
                        " your event: " + event.getTitle();
        
        Notification notification = Notification.builder()
                .user(event.getOrganizer())
                .message(message)
                .type(status == RSVP.RSVPStatus.CONFIRMED ? 
                      Notification.NotificationType.RSVP_CONFIRMED : 
                      Notification.NotificationType.RSVP_WAITLIST)
                .relatedEventId(eventId)
                .build();
        
        notificationRepository.save(notification);
        
        // Send WebSocket notification
        messagingTemplate.convertAndSendToUser(
                event.getOrganizer().getEmail(),
                "/queue/notifications",
                message
        );
        
        return mapToResponse(rsvp);
    }
    
    @Transactional
    public void cancelRSVP(Long eventId, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        RSVP rsvp = rsvpRepository.findByUserIdAndEventId(user.getId(), eventId)
                .orElseThrow(() -> new ResourceNotFoundException("RSVP not found"));
        
        Event event = rsvp.getEvent();
        boolean wasConfirmed = rsvp.getStatus() == RSVP.RSVPStatus.CONFIRMED;
        
        rsvpRepository.delete(rsvp);
        
        // Notify organizer that someone left the event
        String leaveMessage = user.getFirstName() + " " + user.getLastName() + 
                             " has left your event: " + event.getTitle();
        Notification organizerNotification = Notification.builder()
                .user(event.getOrganizer())
                .message(leaveMessage)
                .type(Notification.NotificationType.EVENT_UPDATE)
                .relatedEventId(eventId)
                .build();
        
        notificationRepository.save(organizerNotification);
        
        messagingTemplate.convertAndSendToUser(
                event.getOrganizer().getEmail(),
                "/queue/notifications",
                leaveMessage
        );
        
        // If cancelled RSVP was confirmed and there are waitlisted users, promote one
        if (wasConfirmed) {
            List<RSVP> waitlist = rsvpRepository.findByEventIdAndStatus(eventId, RSVP.RSVPStatus.WAITLIST);
            if (!waitlist.isEmpty()) {
                RSVP firstInWaitlist = waitlist.get(0);
                firstInWaitlist.setStatus(RSVP.RSVPStatus.CONFIRMED);
                rsvpRepository.save(firstInWaitlist);
                
                // Notify promoted user
                Notification notification = Notification.builder()
                        .user(firstInWaitlist.getUser())
                        .message("You've been moved from waitlist to confirmed for: " + event.getTitle())
                        .type(Notification.NotificationType.WAITLIST_PROMOTED)
                        .relatedEventId(eventId)
                        .build();
                
                notificationRepository.save(notification);
                
                messagingTemplate.convertAndSendToUser(
                        firstInWaitlist.getUser().getEmail(),
                        "/queue/notifications",
                        notification.getMessage()
                );
            }
        }
    }
    
    @Transactional(readOnly = true)
    public List<RSVPResponse> getUserRSVPs(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        return rsvpRepository.findByUserId(user.getId()).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }
    
    @Transactional(readOnly = true)
    public List<RSVPResponse> getEventRSVPs(Long eventId) {
        return rsvpRepository.findByEventId(eventId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }
    
    private RSVPResponse mapToResponse(RSVP rsvp) {
        return RSVPResponse.builder()
                .id(rsvp.getId())
                .userId(rsvp.getUser().getId())
                .userName(rsvp.getUser().getFirstName() + " " + rsvp.getUser().getLastName())
                .eventId(rsvp.getEvent().getId())
                .eventTitle(rsvp.getEvent().getTitle())
                .status(rsvp.getStatus())
                .createdAt(rsvp.getCreatedAt())
                .build();
    }
}
