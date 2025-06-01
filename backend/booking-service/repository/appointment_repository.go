package repository

import (
	"github.com/google/uuid"
	"github.com/smartappointment/booking-service/models"
	"gorm.io/gorm"
)

type AppointmentRepository struct {
	db *gorm.DB
}

func NewAppointmentRepository(db *gorm.DB) *AppointmentRepository {
	return &AppointmentRepository{db: db}
}

func (r *AppointmentRepository) Create(appointment *models.Appointment) error {
	return r.db.Create(appointment).Error
}

func (r *AppointmentRepository) GetByID(id uuid.UUID) (*models.Appointment, error) {
	var appointment models.Appointment
	err := r.db.First(&appointment, "id = ?", id).Error
	if err != nil {
		return nil, err
	}
	return &appointment, nil
}

func (r *AppointmentRepository) Update(appointment *models.Appointment) error {
	return r.db.Save(appointment).Error
}

func (r *AppointmentRepository) Delete(id uuid.UUID) error {
	return r.db.Delete(&models.Appointment{}, "id = ?", id).Error
}

func (r *AppointmentRepository) List(params map[string]interface{}) ([]models.Appointment, error) {
	var appointments []models.Appointment
	query := r.db

	if branchID, ok := params["branch_id"]; ok {
		query = query.Where("branch_id = ?", branchID)
	}

	if customerID, ok := params["customer_id"]; ok {
		query = query.Where("customer_id = ?", customerID)
	}

	if staffID, ok := params["staff_id"]; ok {
		query = query.Where("staff_id = ?", staffID)
	}

	if status, ok := params["status"]; ok {
		query = query.Where("status = ?", status)
	}

	err := query.Find(&appointments).Error
	if err != nil {
		return nil, err
	}

	return appointments, nil
}

func (r *AppointmentRepository) GetConflictingAppointments(branchID uuid.UUID, staffID uuid.UUID, startTime string, endTime string) ([]models.Appointment, error) {
	var appointments []models.Appointment
	err := r.db.Where(
		"branch_id = ? AND staff_id = ? AND scheduled_time BETWEEN ? AND ? AND status NOT IN ?",
		branchID,
		staffID,
		startTime,
		endTime,
		[]models.AppointmentStatus{models.StatusCancelled, models.StatusNoShow},
	).Find(&appointments).Error
	return appointments, err
} 