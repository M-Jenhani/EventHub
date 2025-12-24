package com.eventhub.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "events")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Event {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String title;
    
    @Column(length = 2000)
    private String description;
    
    @Column(nullable = false)
    private LocalDateTime eventDate;
    
    @Column(nullable = false)
    private String location;
    
    @Column(nullable = false)
    private Integer capacity;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Category category;
    
    private String posterUrl;
    
    @Column(nullable = false)
    @Builder.Default
    private Boolean published = true;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "organizer_id", nullable = false)
    private User organizer;
    
    @OneToMany(mappedBy = "event", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private Set<RSVP> rsvps = new HashSet<>();
    
    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    private LocalDateTime updatedAt;
    
    public enum Category {
        CONFERENCE,
        WORKSHOP,
        SEMINAR,
        MEETUP,
        WEBINAR,
        CONCERT,
        SPORTS,
        SOCIAL,
        NETWORKING,
        OTHER
    }
    
    public long getAttendeeCount() {
        if (rsvps == null) {
            return 0;
        }
        return rsvps.stream()
                .filter(rsvp -> rsvp.getStatus() == RSVP.RSVPStatus.CONFIRMED)
                .count();
    }
    
    public boolean isFull() {
        return getAttendeeCount() >= capacity;
    }
}
