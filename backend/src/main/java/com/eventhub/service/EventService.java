package com.eventhub.service;

import com.eventhub.dto.EventRequest;
import com.eventhub.dto.EventResponse;
import com.eventhub.exception.ResourceNotFoundException;
import com.eventhub.exception.UnauthorizedException;
import com.eventhub.model.Event;
import com.eventhub.model.User;
import com.eventhub.repository.EventRepository;
import com.eventhub.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EventService {
    
    private final EventRepository eventRepository;
    private final UserRepository userRepository;
    
    @Transactional
    public EventResponse createEvent(EventRequest request, String userEmail) {
        User organizer = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        Event event = Event.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .eventDate(request.getEventDate())
                .location(request.getLocation())
                .capacity(request.getCapacity())
                .category(request.getCategory())
                .posterUrl(request.getPosterUrl())
                .published(request.getPublished())
                .organizer(organizer)
                .build();
        
        event = eventRepository.save(event);
        return mapToResponse(event);
    }
    
    @Transactional
    public EventResponse updateEvent(Long id, EventRequest request, String userEmail) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found"));
        
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        if (!event.getOrganizer().getId().equals(user.getId()) && !user.getRole().equals(User.Role.ADMIN)) {
            throw new UnauthorizedException("You don't have permission to update this event");
        }
        
        event.setTitle(request.getTitle());
        event.setDescription(request.getDescription());
        event.setEventDate(request.getEventDate());
        event.setLocation(request.getLocation());
        event.setCapacity(request.getCapacity());
        event.setCategory(request.getCategory());
        event.setPosterUrl(request.getPosterUrl());
        event.setPublished(request.getPublished());
        
        event = eventRepository.save(event);
        return mapToResponse(event);
    }
    
    @Transactional
    public void deleteEvent(Long id, String userEmail) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found"));
        
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        if (!event.getOrganizer().getId().equals(user.getId()) && !user.getRole().equals(User.Role.ADMIN)) {
            throw new UnauthorizedException("You don't have permission to delete this event");
        }
        
        eventRepository.delete(event);
    }
    
    @Transactional(readOnly = true)
    public EventResponse getEventById(Long id) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found"));
        return mapToResponse(event);
    }
    
    @Transactional(readOnly = true)
    public List<EventResponse> getAllEvents() {
        return eventRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }
    
    @Transactional(readOnly = true)
    public List<EventResponse> getUpcomingEvents() {
        return eventRepository.findByEventDateAfter(LocalDateTime.now()).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }
    
    @Transactional(readOnly = true)
    public List<EventResponse> getEventsByOrganizer(Long organizerId) {
        return eventRepository.findByOrganizerId(organizerId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }
    
    @Transactional(readOnly = true)
    public List<EventResponse> searchEvents(Event.Category category, String location, 
                                          LocalDateTime startDate, LocalDateTime endDate) {
        return eventRepository.searchEvents(category, location, startDate, endDate).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }
    
    @Transactional(readOnly = true)
    public List<EventResponse> searchByKeyword(String keyword) {
        return eventRepository.searchByKeyword(keyword).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }
    
    private EventResponse mapToResponse(Event event) {
        return EventResponse.builder()
                .id(event.getId())
                .title(event.getTitle())
                .description(event.getDescription())
                .eventDate(event.getEventDate())
                .location(event.getLocation())
                .capacity(event.getCapacity())
                .category(event.getCategory())
                .posterUrl(event.getPosterUrl())
                .published(event.getPublished())
                .organizerId(event.getOrganizer().getId())
                .organizerName(event.getOrganizer().getFirstName() + " " + event.getOrganizer().getLastName())
                .attendeeCount(event.getAttendeeCount())
                .isFull(event.isFull())
                .createdAt(event.getCreatedAt())
                .updatedAt(event.getUpdatedAt())
                .build();
    }
}
