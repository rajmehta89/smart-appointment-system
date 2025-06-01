package repository

import (
	"context"
	"encoding/json"
	"fmt"
	"time"

	"github.com/go-redis/redis/v8"
	"github.com/google/uuid"
	"github.com/smartappointment/booking-service/models"
	"gorm.io/gorm"
)

type TokenRepository struct {
	db    *gorm.DB
	redis *redis.Client
}

func NewTokenRepository(db *gorm.DB, redis *redis.Client) *TokenRepository {
	return &TokenRepository{
		db:    db,
		redis: redis,
	}
}

func (r *TokenRepository) Create(token *models.Token) error {
	// Generate token number
	var maxToken int
	r.db.Model(&models.Token{}).
		Where("branch_id = ? AND DATE(created_at) = CURRENT_DATE", token.BranchID).
		Select("COALESCE(MAX(token_number), 0)").
		Row().
		Scan(&maxToken)

	token.TokenNumber = maxToken + 1

	// Save to database
	if err := r.db.Create(token).Error; err != nil {
		return err
	}

	// Update Redis queue
	ctx := context.Background()
	queueKey := fmt.Sprintf("queue:%s", token.BranchID)
	tokenJSON, _ := json.Marshal(token)
	
	r.redis.RPush(ctx, queueKey, tokenJSON)
	return nil
}

func (r *TokenRepository) GetByID(id uuid.UUID) (*models.Token, error) {
	var token models.Token
	err := r.db.First(&token, "id = ?", id).Error
	if err != nil {
		return nil, err
	}
	return &token, nil
}

func (r *TokenRepository) Update(token *models.Token) error {
	return r.db.Save(token).Error
}

func (r *TokenRepository) GetCurrentToken(branchID uuid.UUID) (*models.Token, error) {
	var token models.Token
	err := r.db.Where(
		"branch_id = ? AND status = ? AND DATE(created_at) = CURRENT_DATE",
		branchID,
		models.TokenStatusServing,
	).First(&token).Error
	if err != nil {
		return nil, err
	}
	return &token, nil
}

func (r *TokenRepository) GetQueueStatus(branchID uuid.UUID) (*models.QueueStatus, error) {
	var waitingCount int64
	r.db.Model(&models.Token{}).
		Where(
			"branch_id = ? AND status = ? AND DATE(created_at) = CURRENT_DATE",
			branchID,
			models.TokenStatusWaiting,
		).Count(&waitingCount)

	var currentToken models.Token
	r.db.Where(
		"branch_id = ? AND status = ? AND DATE(created_at) = CURRENT_DATE",
		branchID,
		models.TokenStatusServing,
	).First(&currentToken)

	// Calculate estimated wait time (assuming 15 minutes per token)
	estimatedWaitMins := int(waitingCount) * 15

	return &models.QueueStatus{
		CurrentToken:      currentToken.TokenNumber,
		WaitingCount:     int(waitingCount),
		EstimatedWaitMins: estimatedWaitMins,
	}, nil
}

func (r *TokenRepository) GetNextToken(branchID uuid.UUID) (*models.Token, error) {
	var token models.Token
	err := r.db.Where(
		"branch_id = ? AND status = ? AND DATE(created_at) = CURRENT_DATE",
		branchID,
		models.TokenStatusWaiting,
	).Order("token_number ASC").First(&token).Error
	if err != nil {
		return nil, err
	}
	return &token, nil
}

func (r *TokenRepository) CompleteCurrentToken(branchID uuid.UUID) error {
	ctx := context.Background()
	now := time.Now()

	// Update current token status
	err := r.db.Model(&models.Token{}).
		Where(
			"branch_id = ? AND status = ? AND DATE(created_at) = CURRENT_DATE",
			branchID,
			models.TokenStatusServing,
		).
		Updates(map[string]interface{}{
			"status":       models.TokenStatusCompleted,
			"completed_at": now,
		}).Error
	if err != nil {
		return err
	}

	// Update Redis queue
	queueKey := fmt.Sprintf("queue:%s", branchID)
	r.redis.LPop(ctx, queueKey)

	return nil
} 