package main

import (
	"log"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/smartappointment/booking-service/config"
	"github.com/smartappointment/booking-service/handlers"
	"github.com/smartappointment/booking-service/middleware"
	"github.com/smartappointment/booking-service/models"
	"github.com/smartappointment/booking-service/repository"
	"github.com/smartappointment/booking-service/services"
	swaggerFiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"
)

// @title           Smart Appointment Booking API
// @version         1.0
// @description     API for managing appointments and tokens
// @termsOfService  http://swagger.io/terms/

// @contact.name   API Support
// @contact.url    http://www.swagger.io/support
// @contact.email  support@swagger.io

// @license.name  Apache 2.0
// @license.url   http://www.apache.org/licenses/LICENSE-2.0.html

// @host      localhost:8081
// @BasePath  /api/v1

// @securityDefinitions.apikey BearerAuth
// @in header
// @name Authorization
func main() {
	// Initialize configuration
	cfg := config.LoadConfig()

	// Initialize database
	db, err := models.InitDB(cfg.DatabaseURL)
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}

	// Initialize Redis
	redisClient := models.InitRedis(cfg.RedisURL)

	// Initialize repositories
	appointmentRepo := repository.NewAppointmentRepository(db)
	slotRepo := repository.NewSlotRepository(db)
	tokenRepo := repository.NewTokenRepository(db, redisClient)

	// Initialize services
	appointmentService := services.NewAppointmentService(appointmentRepo, slotRepo, tokenRepo)
	tokenService := services.NewTokenService(tokenRepo)

	// Initialize handlers
	appointmentHandler := handlers.NewAppointmentHandler(appointmentService)
	tokenHandler := handlers.NewTokenHandler(tokenService)

	// Initialize Gin router
	router := gin.Default()

	// Middleware
	router.Use(middleware.CORSMiddleware())
	router.Use(middleware.RequestLogger())

	// API v1 routes
	v1 := router.Group("/api/v1")
	{
		// Health check
		v1.GET("/health", handlers.HealthCheck)

		// Protected routes
		protected := v1.Group("")
		protected.Use(middleware.AuthMiddleware())
		{
			// Appointment routes
			appointments := protected.Group("/appointments")
			{
				appointments.POST("", appointmentHandler.CreateAppointment)
				appointments.GET("", appointmentHandler.ListAppointments)
				appointments.GET("/:id", appointmentHandler.GetAppointment)
				appointments.PUT("/:id", appointmentHandler.UpdateAppointment)
				appointments.DELETE("/:id", appointmentHandler.CancelAppointment)
			}

			// Token routes
			tokens := protected.Group("/tokens")
			{
				tokens.POST("", tokenHandler.IssueToken)
				tokens.GET("/current", tokenHandler.GetCurrentToken)
				tokens.GET("/queue", tokenHandler.GetQueueStatus)
				tokens.PUT("/:id/next", tokenHandler.CallNextToken)
				tokens.PUT("/:id/complete", tokenHandler.CompleteToken)
			}

			// Slot management routes
			slots := protected.Group("/slots")
			{
				slots.POST("", appointmentHandler.CreateTimeSlot)
				slots.GET("", appointmentHandler.ListAvailableSlots)
				slots.PUT("/:id", appointmentHandler.UpdateTimeSlot)
				slots.DELETE("/:id", appointmentHandler.DeleteTimeSlot)
			}
		}
	}

	// Swagger documentation
	router.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))

	// Start server
	port := os.Getenv("PORT")
	if port == "" {
		port = "8081"
	}
	
	if err := router.Run(":" + port); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}
