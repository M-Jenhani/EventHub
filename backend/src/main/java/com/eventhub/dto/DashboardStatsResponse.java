package com.eventhub.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardStatsResponse {
    private Long totalEvents;
    private Long totalUsers;
    private Long totalRSVPs;
    private Long upcomingEvents;
    private Long pastEvents;
}
