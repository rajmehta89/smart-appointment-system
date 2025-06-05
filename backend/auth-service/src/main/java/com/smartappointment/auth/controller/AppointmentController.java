package com.smartappointment.auth.controller;

import com.smartappointment.auth.entity.Appointment;
import com.smartappointment.auth.service.AppointmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/appointments")
public class AppointmentController {

    @Autowired
    private AppointmentService appointmentService;

    @PostMapping
    public ResponseEntity<?> createAppointment(Authentication authentication, @RequestBody Map<String, String> request) {

        try {

            var userEmail = authentication.getName();

            var serviceId = Long.parseLong(request.get("serviceId"));

            var dateTime = LocalDateTime.parse(request.get("dateTime"));

            var appointment = appointmentService.createAppointment(userEmail, serviceId, dateTime);

            return ResponseEntity.ok(appointment);

        } catch (Exception e) {

            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));

        }

    }

    @GetMapping("/upcoming")
    public ResponseEntity<List<Appointment>> getUpcomingAppointments(Authentication authentication) {

        var userEmail = authentication.getName();

        List<Appointment> appointments = appointmentService.getUpcomingAppointments(userEmail);

        return ResponseEntity.ok(appointments);

    }

    @GetMapping("/available-slots")
    public ResponseEntity<List<String>> getAvailableTimeSlots( @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {

        List<String> availableSlots = appointmentService.getAvailableTimeSlots(date);

        return ResponseEntity.ok(availableSlots);

    }

    @PostMapping("/{id}/cancel")
    public ResponseEntity<?> cancelAppointment(@PathVariable Long id, Authentication authentication) {

        try {

            var userEmail = authentication.getName();

            appointmentService.cancelAppointment(id, userEmail);

            return ResponseEntity.ok().build();

        } catch (Exception e) {

            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
            
        }

    }

} 