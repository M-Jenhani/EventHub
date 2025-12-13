package com.eventhub.dto;

import com.eventhub.model.Notification;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NotificationResponse {
    private Long id;
    private String message;
    private Boolean read;
    private Notification.NotificationType type;
    private Long relatedEventId;
    private LocalDateTime createdAt;
}
