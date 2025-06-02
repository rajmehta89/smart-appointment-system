package com.smartappointment.auth.repository;

import com.smartappointment.auth.entity.Appointment;
import com.smartappointment.auth.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    List<Appointment> findByUserOrderByDateTimeDesc(User user);
    
    List<Appointment> findByUserAndDateTimeGreaterThanEqualOrderByDateTime(User user, LocalDateTime dateTime);
    
    @Query("SELECT a FROM Appointment a WHERE a.dateTime BETWEEN ?1 AND ?2")
    List<Appointment> findAppointmentsInTimeRange(LocalDateTime start, LocalDateTime end);
    
    boolean existsByDateTimeBetween(LocalDateTime start, LocalDateTime end);
} 