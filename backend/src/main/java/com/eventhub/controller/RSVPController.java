package com.eventhub.controller;

import com.eventhub.dto.RSVPResponse;
import com.eventhub.service.RSVPService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/rsvps")
@RequiredArgsConstructor
public class RSVPController {
    
    private final RSVPService rsvpService;
    
    @PostMapping("/events/{eventId}")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<RSVPResponse> createRSVP(
            @PathVariable Long eventId,
            Authentication authentication) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(rsvpService.createRSVP(eventId, authentication.getName()));
    }
    
    @DeleteMapping("/events/{eventId}")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<Void> cancelRSVP(
            @PathVariable Long eventId,
            Authentication authentication) {
        rsvpService.cancelRSVP(eventId, authentication.getName());
        return ResponseEntity.noContent().build();
    }
    
    @GetMapping("/my-rsvps")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<List<RSVPResponse>> getUserRSVPs(Authentication authentication) {
        return ResponseEntity.ok(rsvpService.getUserRSVPs(authentication.getName()));
    }
    
    @GetMapping("/events/{eventId}")
    public ResponseEntity<List<RSVPResponse>> getEventRSVPs(@PathVariable Long eventId) {
        return ResponseEntity.ok(rsvpService.getEventRSVPs(eventId));
    }
}
