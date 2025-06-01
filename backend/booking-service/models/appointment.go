package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type AppointmentStatus string

const (
	StatusScheduled   AppointmentStatus = "SCHEDULED"
	StatusInProgress  AppointmentStatus = "IN_PROGRESS"
	StatusCompleted   AppointmentStatus = "COMPLETED"
	StatusCancelled   AppointmentStatus = "CANCELLED"
	StatusNoShow      AppointmentStatus = "NO_SHOW"
)

type Appointment struct {
	ID                 uuid.UUID         `json:"id" gorm:"type:uuid;primary_key;default:uuid_generate_v4()"`
	CustomerID         uuid.UUID         `json:"customer_id" gorm:"type:uuid;not null"`
	BranchID          uuid.UUID         `json:"branch_id" gorm:"type:uuid;not null"`
	ServiceID         uuid.UUID         `json:"service_id" gorm:"type:uuid;not null"`
	StaffID           uuid.UUID         `json:"staff_id" gorm:"type:uuid"`
	ScheduledTime     time.Time         `json:"scheduled_time" gorm:"not null"`
	Status            AppointmentStatus `json:"status" gorm:"type:varchar(20);not null;default:'SCHEDULED'"`
	TokenNumber       *int              `json:"token_number"`
	EstimatedWaitMins *int              `json:"estimated_wait_minutes"`
	Notes             string            `json:"notes" gorm:"type:text"`
	CreatedAt         time.Time         `json:"created_at" gorm:"not null;default:CURRENT_TIMESTAMP"`
	UpdatedAt         time.Time         `json:"updated_at" gorm:"not null;default:CURRENT_TIMESTAMP"`
}

func (a *Appointment) BeforeCreate(tx *gorm.DB) error {
	if a.ID == uuid.Nil {
		a.ID = uuid.New()
	}
	return nil
}

type AppointmentRequest struct {
	CustomerID     uuid.UUID `json:"customer_id" binding:"required"`
	BranchID      uuid.UUID `json:"branch_id" binding:"required"`
	ServiceID     uuid.UUID `json:"service_id" binding:"required"`
	StaffID       uuid.UUID `json:"staff_id"`
	ScheduledTime time.Time `json:"scheduled_time" binding:"required"`
	Notes         string    `json:"notes"`
}

type AppointmentResponse struct {
	ID                 uuid.UUID         `json:"id"`
	CustomerID         uuid.UUID         `json:"customer_id"`
	BranchID          uuid.UUID         `json:"branch_id"`
	ServiceID         uuid.UUID         `json:"service_id"`
	StaffID           uuid.UUID         `json:"staff_id,omitempty"`
	ScheduledTime     time.Time         `json:"scheduled_time"`
	Status            AppointmentStatus `json:"status"`
	TokenNumber       *int              `json:"token_number,omitempty"`
	EstimatedWaitMins *int              `json:"estimated_wait_minutes,omitempty"`
	Notes             string            `json:"notes,omitempty"`
	CreatedAt         time.Time         `json:"created_at"`
	UpdatedAt         time.Time         `json:"updated_at"`
} 