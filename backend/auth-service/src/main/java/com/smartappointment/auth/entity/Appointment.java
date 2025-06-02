package com.smartappointment.auth.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "appointments")
public class Appointment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private Long serviceId;

    @Column(nullable = false)
    private String serviceName;

    @Column(nullable = false)
    private LocalDateTime dateTime;

    @Column(nullable = false)
    private String status;

    public Appointment() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Long getServiceId() {
        return serviceId;
    }

    public void setServiceId(Long serviceId) {
        this.serviceId = serviceId;
    }

    public String getServiceName() {
        return serviceName;
    }

    public void setServiceName(String serviceName) {
        this.serviceName = serviceName;
    }

    public LocalDateTime getDateTime() {
        return dateTime;
    }

    public void setDateTime(LocalDateTime dateTime) {
        this.dateTime = dateTime;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public static AppointmentBuilder builder() {
        return new AppointmentBuilder();
    }

    public static class AppointmentBuilder {
        private final Appointment appointment;

        AppointmentBuilder() {
            appointment = new Appointment();
        }

        public AppointmentBuilder id(Long id) {
            appointment.setId(id);
            return this;
        }

        public AppointmentBuilder user(User user) {
            appointment.setUser(user);
            return this;
        }

        public AppointmentBuilder serviceId(Long serviceId) {
            appointment.setServiceId(serviceId);
            return this;
        }

        public AppointmentBuilder serviceName(String serviceName) {
            appointment.setServiceName(serviceName);
            return this;
        }

        public AppointmentBuilder dateTime(LocalDateTime dateTime) {
            appointment.setDateTime(dateTime);
            return this;
        }

        public AppointmentBuilder status(String status) {
            appointment.setStatus(status);
            return this;
        }

        public Appointment build() {
            return appointment;
        }
    }
} 