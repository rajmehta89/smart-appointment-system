package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/smartappointment/booking-service/models"
	"github.com/smartappointment/booking-service/services"
)

type TokenHandler struct {
	tokenService *services.TokenService
}

func NewTokenHandler(tokenService *services.TokenService) *TokenHandler {
	return &TokenHandler{
		tokenService: tokenService,
	}
}

// @Summary Issue a new token
// @Description Issue a new token for a customer
// @Tags tokens
// @Accept json
// @Produce json
// @Param token body models.TokenRequest true "Token request details"
// @Success 201 {object} models.TokenResponse
// @Failure 400 {object} ErrorResponse
// @Router /tokens [post]
// @Security BearerAuth
func (h *TokenHandler) IssueToken(c *gin.Context) {
	var req models.TokenRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, ErrorResponse{Error: err.Error()})
		return
	}

	token, err := h.tokenService.IssueToken(&req)
	if err != nil {
		c.JSON(http.StatusBadRequest, ErrorResponse{Error: err.Error()})
		return
	}

	c.JSON(http.StatusCreated, token)
}

// @Summary Get current token
// @Description Get the currently serving token for a branch
// @Tags tokens
// @Produce json
// @Param branch_id query string true "Branch ID"
// @Success 200 {object} models.TokenResponse
// @Failure 404 {object} ErrorResponse
// @Router /tokens/current [get]
// @Security BearerAuth
func (h *TokenHandler) GetCurrentToken(c *gin.Context) {
	branchID, err := uuid.Parse(c.Query("branch_id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, ErrorResponse{Error: "invalid branch ID"})
		return
	}

	token, err := h.tokenService.GetCurrentToken(branchID)
	if err != nil {
		c.JSON(http.StatusNotFound, ErrorResponse{Error: "no current token found"})
		return
	}

	c.JSON(http.StatusOK, token)
}

// @Summary Get queue status
// @Description Get the current queue status for a branch
// @Tags tokens
// @Produce json
// @Param branch_id query string true "Branch ID"
// @Success 200 {object} models.QueueStatus
// @Failure 400 {object} ErrorResponse
// @Router /tokens/queue [get]
// @Security BearerAuth
func (h *TokenHandler) GetQueueStatus(c *gin.Context) {
	branchID, err := uuid.Parse(c.Query("branch_id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, ErrorResponse{Error: "invalid branch ID"})
		return
	}

	status, err := h.tokenService.GetQueueStatus(branchID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, ErrorResponse{Error: err.Error()})
		return
	}

	c.JSON(http.StatusOK, status)
}

// @Summary Call next token
// @Description Call the next token in the queue
// @Tags tokens
// @Produce json
// @Param branch_id path string true "Branch ID"
// @Success 200 {object} models.TokenResponse
// @Failure 404 {object} ErrorResponse
// @Router /tokens/{branch_id}/next [put]
// @Security BearerAuth
func (h *TokenHandler) CallNextToken(c *gin.Context) {
	branchID, err := uuid.Parse(c.Param("branch_id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, ErrorResponse{Error: "invalid branch ID"})
		return
	}

	token, err := h.tokenService.CallNextToken(branchID)
	if err != nil {
		c.JSON(http.StatusNotFound, ErrorResponse{Error: err.Error()})
		return
	}

	c.JSON(http.StatusOK, token)
}

// @Summary Complete token
// @Description Mark a token as completed
// @Tags tokens
// @Produce json
// @Param id path string true "Token ID"
// @Success 200 {object} SuccessResponse
// @Failure 404 {object} ErrorResponse
// @Router /tokens/{id}/complete [put]
// @Security BearerAuth
func (h *TokenHandler) CompleteToken(c *gin.Context) {
	id, err := uuid.Parse(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, ErrorResponse{Error: "invalid token ID"})
		return
	}

	if err := h.tokenService.CompleteToken(id); err != nil {
		c.JSON(http.StatusNotFound, ErrorResponse{Error: err.Error()})
		return
	}

	c.JSON(http.StatusOK, SuccessResponse{Message: "token completed successfully"})
} 