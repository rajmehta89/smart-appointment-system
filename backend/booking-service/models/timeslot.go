package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type TimeSlot struct {
	ID          uuid.UUID `json:"id" gorm:"type:uuid;primary_key;default:uuid_generate_v4()"`
	BranchID    uuid.UUID `json:"branch_id" gorm:"type:uuid;not null"`
	StaffID     uuid.UUID `json:"staff_id" gorm:"type:uuid"`
	StartTime   time.Time `json:"start_time" gorm:"not null"`
	EndTime     time.Time `json:"end_time" gorm:"not null"`
	Capacity    int       `json:"capacity" gorm:"not null;default:1"`
	IsAvailable bool      `json:"is_available" gorm:"not null;default:true"`
	CreatedAt   time.Time `json:"created_at" gorm:"not null;default:CURRENT_TIMESTAMP"`
	UpdatedAt   time.Time `json:"updated_at" gorm:"not null;default:CURRENT_TIMESTAMP"`
}

func (ts *TimeSlot) BeforeCreate(tx *gorm.DB) error {
	if ts.ID == uuid.Nil {
		ts.ID = uuid.New()
	}
	return nil
}

type TimeSlotRequest struct {
	BranchID  uuid.UUID `json:"branch_id" binding:"required"`
	StaffID   uuid.UUID `json:"staff_id"`
	StartTime time.Time `json:"start_time" binding:"required"`
	EndTime   time.Time `json:"end_time" binding:"required"`
	Capacity  int       `json:"capacity"`
}

type TimeSlotResponse struct {
	ID          uuid.UUID `json:"id"`
	BranchID    uuid.UUID `json:"branch_id"`
	StaffID     uuid.UUID `json:"staff_id,omitempty"`
	StartTime   time.Time `json:"start_time"`
	EndTime     time.Time `json:"end_time"`
	Capacity    int       `json:"capacity"`
	IsAvailable bool      `json:"is_available"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}

type AvailabilityQuery struct {
	BranchID  uuid.UUID  `form:"branch_id" binding:"required"`
	StaffID   *uuid.UUID `form:"staff_id"`
	StartDate time.Time  `form:"start_date" binding:"required"`
	EndDate   time.Time  `form:"end_date" binding:"required"`
} 