package com.eventhub.dto;

import com.eventhub.model.Event;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EventResponse {
    private Long id;
    private String title;
    private String description;
    private LocalDateTime eventDate;
    private String location;
    private Integer capacity;
    private Event.Category category;
    private String posterUrl;
    private Boolean published;
    private Long organizerId;
    private String organizerName;
    private Long attendeeCount;
    private Boolean isFull;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
