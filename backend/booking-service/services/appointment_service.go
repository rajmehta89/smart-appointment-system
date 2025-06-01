package services

import (
	"errors"
	"time"

	"github.com/google/uuid"
	"github.com/smartappointment/booking-service/models"
	"github.com/smartappointment/booking-service/repository"
)

type AppointmentService struct {
	appointmentRepo *repository.AppointmentRepository
	slotRepo       *repository.SlotRepository
	tokenRepo      *repository.TokenRepository
}

func NewAppointmentService(
	appointmentRepo *repository.AppointmentRepository,
	slotRepo *repository.SlotRepository,
	tokenRepo *repository.TokenRepository,
) *AppointmentService {
	return &AppointmentService{
		appointmentRepo: appointmentRepo,
		slotRepo:       slotRepo,
		tokenRepo:      tokenRepo,
	}
}

func (s *AppointmentService) CreateAppointment(req *models.AppointmentRequest) (*models.AppointmentResponse, error) {
	// Check slot availability
	isAvailable, err := s.slotRepo.CheckSlotAvailability(req.BranchID, req.StaffID, req.ScheduledTime)
	if err != nil {
		return nil, err
	}
	if !isAvailable {
		return nil, errors.New("selected time slot is not available")
	}

	// Check for conflicting appointments
	conflicts, err := s.appointmentRepo.GetConflictingAppointments(
		req.BranchID,
		req.StaffID,
		req.ScheduledTime.Format(time.RFC3339),
		req.ScheduledTime.Add(30*time.Minute).Format(time.RFC3339),
	)
	if err != nil {
		return nil, err
	}
	if len(conflicts) > 0 {
		return nil, errors.New("conflicting appointment exists")
	}

	// Create appointment
	appointment := &models.Appointment{
		CustomerID:     req.CustomerID,
		BranchID:      req.BranchID,
		ServiceID:     req.ServiceID,
		StaffID:       req.StaffID,
		ScheduledTime: req.ScheduledTime,
		Status:        models.StatusScheduled,
		Notes:        req.Notes,
	}

	if err := s.appointmentRepo.Create(appointment); err != nil {
		return nil, err
	}

	return &models.AppointmentResponse{
		ID:           appointment.ID,
		CustomerID:   appointment.CustomerID,
		BranchID:     appointment.BranchID,
		ServiceID:    appointment.ServiceID,
		StaffID:      appointment.StaffID,
		ScheduledTime: appointment.ScheduledTime,
		Status:       appointment.Status,
		Notes:        appointment.Notes,
		CreatedAt:    appointment.CreatedAt,
		UpdatedAt:    appointment.UpdatedAt,
	}, nil
}

func (s *AppointmentService) GetAppointment(id uuid.UUID) (*models.AppointmentResponse, error) {
	appointment, err := s.appointmentRepo.GetByID(id)
	if err != nil {
		return nil, err
	}

	return &models.AppointmentResponse{
		ID:           appointment.ID,
		CustomerID:   appointment.CustomerID,
		BranchID:     appointment.BranchID,
		ServiceID:    appointment.ServiceID,
		StaffID:      appointment.StaffID,
		ScheduledTime: appointment.ScheduledTime,
		Status:       appointment.Status,
		TokenNumber:  appointment.TokenNumber,
		Notes:        appointment.Notes,
		CreatedAt:    appointment.CreatedAt,
		UpdatedAt:    appointment.UpdatedAt,
	}, nil
}

func (s *AppointmentService) ListAppointments(params map[string]interface{}) ([]models.AppointmentResponse, error) {
	appointments, err := s.appointmentRepo.List(params)
	if err != nil {
		return nil, err
	}

	response := make([]models.AppointmentResponse, len(appointments))
	for i, appointment := range appointments {
		response[i] = models.AppointmentResponse{
			ID:           appointment.ID,
			CustomerID:   appointment.CustomerID,
			BranchID:     appointment.BranchID,
			ServiceID:    appointment.ServiceID,
			StaffID:      appointment.StaffID,
			ScheduledTime: appointment.ScheduledTime,
			Status:       appointment.Status,
			TokenNumber:  appointment.TokenNumber,
			Notes:        appointment.Notes,
			CreatedAt:    appointment.CreatedAt,
			UpdatedAt:    appointment.UpdatedAt,
		}
	}

	return response, nil
}

func (s *AppointmentService) UpdateAppointment(id uuid.UUID, req *models.AppointmentRequest) (*models.AppointmentResponse, error) {
	appointment, err := s.appointmentRepo.GetByID(id)
	if err != nil {
		return nil, err
	}

	appointment.StaffID = req.StaffID
	appointment.ScheduledTime = req.ScheduledTime
	appointment.Notes = req.Notes

	if err := s.appointmentRepo.Update(appointment); err != nil {
		return nil, err
	}

	return &models.AppointmentResponse{
		ID:           appointment.ID,
		CustomerID:   appointment.CustomerID,
		BranchID:     appointment.BranchID,
		ServiceID:    appointment.ServiceID,
		StaffID:      appointment.StaffID,
		ScheduledTime: appointment.ScheduledTime,
		Status:       appointment.Status,
		TokenNumber:  appointment.TokenNumber,
		Notes:        appointment.Notes,
		CreatedAt:    appointment.CreatedAt,
		UpdatedAt:    appointment.UpdatedAt,
	}, nil
}

func (s *AppointmentService) CancelAppointment(id uuid.UUID) error {
	appointment, err := s.appointmentRepo.GetByID(id)
	if err != nil {
		return err
	}

	appointment.Status = models.StatusCancelled
	return s.appointmentRepo.Update(appointment)
} 