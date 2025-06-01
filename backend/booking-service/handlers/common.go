package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

type ErrorResponse struct {
	Error string `json:"error"`
}

type SuccessResponse struct {
	Message string `json:"message"`
}

// @Summary Health check endpoint
// @Description Check if the service is running
// @Tags health
// @Produce json
// @Success 200 {object} SuccessResponse
// @Router /health [get]
func HealthCheck(c *gin.Context) {
	c.JSON(http.StatusOK, SuccessResponse{Message: "service is healthy"})
} 