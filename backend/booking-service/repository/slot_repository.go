package repository

import (
	"time"

	"github.com/google/uuid"
	"github.com/smartappointment/booking-service/models"
	"gorm.io/gorm"
)

type SlotRepository struct {
	db *gorm.DB
}

func NewSlotRepository(db *gorm.DB) *SlotRepository {
	return &SlotRepository{db: db}
}

func (r *SlotRepository) Create(slot *models.TimeSlot) error {
	return r.db.Create(slot).Error
}

func (r *SlotRepository) GetByID(id uuid.UUID) (*models.TimeSlot, error) {
	var slot models.TimeSlot
	err := r.db.First(&slot, "id = ?", id).Error
	if err != nil {
		return nil, err
	}
	return &slot, nil
}

func (r *SlotRepository) Update(slot *models.TimeSlot) error {
	return r.db.Save(slot).Error
}

func (r *SlotRepository) Delete(id uuid.UUID) error {
	return r.db.Delete(&models.TimeSlot{}, "id = ?", id).Error
}

func (r *SlotRepository) GetAvailableSlots(branchID uuid.UUID, staffID *uuid.UUID, startDate time.Time, endDate time.Time) ([]models.TimeSlot, error) {
	var slots []models.TimeSlot
	query := r.db.Where("branch_id = ? AND start_time BETWEEN ? AND ? AND is_available = true", branchID, startDate, endDate)

	if staffID != nil {
		query = query.Where("staff_id = ?", staffID)
	}

	err := query.Find(&slots).Error
	if err != nil {
		return nil, err
	}

	return slots, nil
}

func (r *SlotRepository) CheckSlotAvailability(branchID uuid.UUID, staffID uuid.UUID, startTime time.Time) (bool, error) {
	var count int64
	err := r.db.Model(&models.TimeSlot{}).
		Where(
			"branch_id = ? AND staff_id = ? AND start_time <= ? AND end_time > ? AND is_available = true",
			branchID,
			staffID,
			startTime,
			startTime,
		).Count(&count).Error

	if err != nil {
		return false, err
	}

	return count > 0, nil
}

func (r *SlotRepository) UpdateSlotAvailability(slotID uuid.UUID, isAvailable bool) error {
	return r.db.Model(&models.TimeSlot{}).
		Where("id = ?", slotID).
		Update("is_available", isAvailable).Error
} 