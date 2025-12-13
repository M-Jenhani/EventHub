package com.eventhub.repository;

import com.eventhub.model.RSVP;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RSVPRepository extends JpaRepository<RSVP, Long> {
    List<RSVP> findByUserId(Long userId);
    
    List<RSVP> findByEventId(Long eventId);
    
    Optional<RSVP> findByUserIdAndEventId(Long userId, Long eventId);
    
    @Query("SELECT r FROM RSVP r WHERE r.user.id = :userId AND r.status = :status")
    List<RSVP> findByUserIdAndStatus(@Param("userId") Long userId, @Param("status") RSVP.RSVPStatus status);
    
    @Query("SELECT r FROM RSVP r WHERE r.event.id = :eventId AND r.status = :status")
    List<RSVP> findByEventIdAndStatus(@Param("eventId") Long eventId, @Param("status") RSVP.RSVPStatus status);
    
    @Query("SELECT COUNT(r) FROM RSVP r WHERE r.event.id = :eventId AND r.status = 'CONFIRMED'")
    Long countConfirmedByEventId(@Param("eventId") Long eventId);
}
