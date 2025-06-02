package com.smartappointment.auth.service;

import com.smartappointment.auth.entity.Appointment;
import com.smartappointment.auth.entity.User;
import com.smartappointment.auth.repository.AppointmentRepository;
import com.smartappointment.auth.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class AppointmentService {

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private UserRepository userRepository;

    public Appointment createAppointment(String userEmail, Long serviceId, LocalDateTime dateTime) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        // Check if the time slot is available
        if (!isTimeSlotAvailable(dateTime)) {
            throw new RuntimeException("Time slot is not available");
        }

        Appointment appointment = Appointment.builder()
                .user(user)
                .serviceId(serviceId)
                .serviceName("Service " + serviceId) // This should be fetched from a service catalog
                .dateTime(dateTime)
                .status("SCHEDULED")
                .build();

        return appointmentRepository.save(appointment);
    }

    public List<Appointment> getUpcomingAppointments(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        
        return appointmentRepository.findByUserAndDateTimeGreaterThanEqualOrderByDateTime(
            user, 
            LocalDateTime.now()
        );
    }

    public List<String> getAvailableTimeSlots(LocalDate date) {
        List<String> availableSlots = new ArrayList<>();
        LocalTime startTime = LocalTime.of(9, 0); // Start at 9 AM
        LocalTime endTime = LocalTime.of(17, 0);  // End at 5 PM
        
        while (startTime.isBefore(endTime)) {
            LocalDateTime slotDateTime = LocalDateTime.of(date, startTime);
            
            if (isTimeSlotAvailable(slotDateTime)) {
                availableSlots.add(startTime.toString());
            }
            
            startTime = startTime.plusMinutes(30); // 30-minute slots
        }
        
        return availableSlots;
    }

    private boolean isTimeSlotAvailable(LocalDateTime dateTime) {
        // Check if there's any appointment in the 30-minute slot
        LocalDateTime slotEnd = dateTime.plusMinutes(30);
        return !appointmentRepository.existsByDateTimeBetween(dateTime, slotEnd);
    }

    public void cancelAppointment(Long appointmentId, String userEmail) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));

        if (!appointment.getUser().getEmail().equals(userEmail)) {
            throw new RuntimeException("Not authorized to cancel this appointment");
        }

        appointment.setStatus("CANCELLED");
        appointmentRepository.save(appointment);
    }
} 