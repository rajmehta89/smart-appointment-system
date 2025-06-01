package models

import (
	"context"
	"log"
	"time"

	"github.com/go-redis/redis/v8"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

var (
	DB    *gorm.DB
	Redis *redis.Client
)

func InitDB(dsn string) (*gorm.DB, error) {
	var err error

	// Configure GORM logger
	gormLogger := logger.New(
		log.New(log.Writer(), "\r\n", log.LstdFlags),
		logger.Config{
			SlowThreshold:             time.Second,
			LogLevel:                  logger.Info,
			IgnoreRecordNotFoundError: true,
			Colorful:                  true,
		},
	)

	// Connect to database
	DB, err = gorm.Open(postgres.Open(dsn), &gorm.Config{
		Logger: gormLogger,
	})
	if err != nil {
		return nil, err
	}

	// Auto migrate schemas
	err = DB.AutoMigrate(
		&Appointment{},
		&Token{},
		&TimeSlot{},
	)
	if err != nil {
		return nil, err
	}

	return DB, nil
}

func InitRedis(addr string) *redis.Client {
	Redis = redis.NewClient(&redis.Options{
		Addr:     addr,
		Password: "", // no password set
		DB:       0,  // use default DB
	})

	// Test connection
	ctx := context.Background()
	_, err := Redis.Ping(ctx).Result()
	if err != nil {
		log.Printf("Error connecting to Redis: %v", err)
	}

	return Redis
} 