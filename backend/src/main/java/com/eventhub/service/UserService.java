package com.eventhub.service;

import com.eventhub.dto.DashboardStatsResponse;
import com.eventhub.dto.UserResponse;
import com.eventhub.exception.ResourceNotFoundException;
import com.eventhub.model.User;
import com.eventhub.repository.EventRepository;
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
        userRepository.delete(user);
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
