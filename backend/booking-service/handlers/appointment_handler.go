package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/smartappointment/booking-service/models"
	"github.com/smartappointment/booking-service/services"
)

type AppointmentHandler struct {
	appointmentService *services.AppointmentService
}

func NewAppointmentHandler(appointmentService *services.AppointmentService) *AppointmentHandler {
	return &AppointmentHandler{
		appointmentService: appointmentService,
	}
}

// @Summary Create a new appointment
// @Description Create a new appointment with the provided details
// @Tags appointments
// @Accept json
// @Produce json
// @Param appointment body models.AppointmentRequest true "Appointment details"
// @Success 201 {object} models.AppointmentResponse
// @Failure 400 {object} ErrorResponse
// @Router /appointments [post]
// @Security BearerAuth
func (h *AppointmentHandler) CreateAppointment(c *gin.Context) {
	var req models.AppointmentRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, ErrorResponse{Error: err.Error()})
		return
	}

	appointment, err := h.appointmentService.CreateAppointment(&req)
	if err != nil {
		c.JSON(http.StatusBadRequest, ErrorResponse{Error: err.Error()})
		return
	}

	c.JSON(http.StatusCreated, appointment)
}

// @Summary Get an appointment by ID
// @Description Get detailed information about an appointment
// @Tags appointments
// @Produce json
// @Param id path string true "Appointment ID"
// @Success 200 {object} models.AppointmentResponse
// @Failure 404 {object} ErrorResponse
// @Router /appointments/{id} [get]
// @Security BearerAuth
func (h *AppointmentHandler) GetAppointment(c *gin.Context) {
	id, err := uuid.Parse(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, ErrorResponse{Error: "invalid appointment ID"})
		return
	}

	appointment, err := h.appointmentService.GetAppointment(id)
	if err != nil {
		c.JSON(http.StatusNotFound, ErrorResponse{Error: "appointment not found"})
		return
	}

	c.JSON(http.StatusOK, appointment)
}

// @Summary List appointments
// @Description Get a list of appointments with optional filters
// @Tags appointments
// @Produce json
// @Param branch_id query string false "Branch ID"
// @Param customer_id query string false "Customer ID"
// @Param staff_id query string false "Staff ID"
// @Success 200 {array} models.AppointmentResponse
// @Router /appointments [get]
// @Security BearerAuth
func (h *AppointmentHandler) ListAppointments(c *gin.Context) {
	params := make(map[string]interface{})

	if branchID := c.Query("branch_id"); branchID != "" {
		id, err := uuid.Parse(branchID)
		if err == nil {
			params["branch_id"] = id
		}
	}

	if customerID := c.Query("customer_id"); customerID != "" {
		id, err := uuid.Parse(customerID)
		if err == nil {
			params["customer_id"] = id
		}
	}

	if staffID := c.Query("staff_id"); staffID != "" {
		id, err := uuid.Parse(staffID)
		if err == nil {
			params["staff_id"] = id
		}
	}

	appointments, err := h.appointmentService.ListAppointments(params)
	if err != nil {
		c.JSON(http.StatusInternalServerError, ErrorResponse{Error: err.Error()})
		return
	}

	c.JSON(http.StatusOK, appointments)
}

// @Summary Update an appointment
// @Description Update an existing appointment's details
// @Tags appointments
// @Accept json
// @Produce json
// @Param id path string true "Appointment ID"
// @Param appointment body models.AppointmentRequest true "Updated appointment details"
// @Success 200 {object} models.AppointmentResponse
// @Failure 400 {object} ErrorResponse
// @Failure 404 {object} ErrorResponse
// @Router /appointments/{id} [put]
// @Security BearerAuth
func (h *AppointmentHandler) UpdateAppointment(c *gin.Context) {
	id, err := uuid.Parse(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, ErrorResponse{Error: "invalid appointment ID"})
		return
	}

	var req models.AppointmentRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, ErrorResponse{Error: err.Error()})
		return
	}

	appointment, err := h.appointmentService.UpdateAppointment(id, &req)
	if err != nil {
		c.JSON(http.StatusNotFound, ErrorResponse{Error: err.Error()})
		return
	}

	c.JSON(http.StatusOK, appointment)
}

// @Summary Cancel an appointment
// @Description Cancel an existing appointment
// @Tags appointments
// @Produce json
// @Param id path string true "Appointment ID"
// @Success 200 {object} SuccessResponse
// @Failure 404 {object} ErrorResponse
// @Router /appointments/{id} [delete]
// @Security BearerAuth
func (h *AppointmentHandler) CancelAppointment(c *gin.Context) {
	id, err := uuid.Parse(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, ErrorResponse{Error: "invalid appointment ID"})
		return
	}

	if err := h.appointmentService.CancelAppointment(id); err != nil {
		c.JSON(http.StatusNotFound, ErrorResponse{Error: err.Error()})
		return
	}

	c.JSON(http.StatusOK, SuccessResponse{Message: "appointment cancelled successfully"})
} 