package com.eventhub.service;

import com.eventhub.dto.DashboardStatsResponse;
import com.eventhub.dto.UserResponse;
import com.eventhub.exception.ResourceNotFoundException;
import com.eventhub.model.User;
import com.eventhub.repository.EventRepository;
import com.eventhub.repository.NotificationRepository;
import com.eventhub.repository.RSVPRepository;
import com.eventhub.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {
    
    private final UserRepository userRepository;
    private final EventRepository eventRepository;
    private final RSVPRepository rsvpRepository;
    private final NotificationRepository notificationRepository;
    
    @Transactional(readOnly = true)
    public UserResponse getCurrentUser(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return mapToResponse(user);
    }
    
    @Transactional(readOnly = true)
    public List<UserResponse> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }
    
    @Transactional(readOnly = true)
    public DashboardStatsResponse getAdminStats() {
        long totalEvents = eventRepository.count();
        long totalUsers = userRepository.count();
        long totalRSVPs = rsvpRepository.count();
        long upcomingEvents = eventRepository.findByEventDateAfter(LocalDateTime.now()).size();
        long pastEvents = eventRepository.findByEventDateBefore(LocalDateTime.now()).size();
        
        return DashboardStatsResponse.builder()
                .totalEvents(totalEvents)
                .totalUsers(totalUsers)
                .totalRSVPs(totalRSVPs)
                .upcomingEvents(upcomingEvents)
                .pastEvents(pastEvents)
                .build();
    }
    
    @Transactional
    public void deleteUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        // Get all event IDs organized by this user
        List<Long> eventIds = eventRepository.findByOrganizerId(userId)
                .stream()
                .map(event -> event.getId())
                .toList();
        
        // 1. Delete notifications related to user's events (before deleting events)
        for (Long eventId : eventIds) {
            notificationRepository.deleteByRelatedEventId(eventId);
        }
        
        // 2. Delete user's own notifications
        notificationRepository.deleteByUserId(userId);
        
        // 3. Delete RSVPs for events organized by this user (other users' RSVPs)
        for (Long eventId : eventIds) {
            rsvpRepository.deleteByEventId(eventId);
        }
        
        // 4. Delete user's own RSVPs to other events
        rsvpRepository.deleteByUserId(userId);
        
        // 5. Delete user's organized events
        eventRepository.deleteByOrganizerId(userId);
        
        // 6. Finally delete the user
        userRepository.deleteById(userId);
    }
    
    private UserResponse mapToResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .phone(user.getPhone())
                .profilePicture(user.getProfilePicture())
                .role(user.getRole().name())
                .build();
    }
}
