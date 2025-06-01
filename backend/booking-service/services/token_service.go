package services

import (
	"errors"
	"time"

	"github.com/google/uuid"
	"github.com/smartappointment/booking-service/models"
	"github.com/smartappointment/booking-service/repository"
)

type TokenService struct {
	tokenRepo *repository.TokenRepository
}

func NewTokenService(tokenRepo *repository.TokenRepository) *TokenService {
	return &TokenService{
		tokenRepo: tokenRepo,
	}
}

func (s *TokenService) IssueToken(req *models.TokenRequest) (*models.TokenResponse, error) {
	// Create new token
	token := &models.Token{
		BranchID:     req.BranchID,
		CustomerID:   req.CustomerID,
		AppointmentID: req.AppointmentID,
		Status:       models.TokenStatusWaiting,
		Notes:        req.Notes,
	}

	if err := s.tokenRepo.Create(token); err != nil {
		return nil, err
	}

	return &models.TokenResponse{
		ID:           token.ID,
		BranchID:     token.BranchID,
		CustomerID:   token.CustomerID,
		AppointmentID: token.AppointmentID,
		TokenNumber:  token.TokenNumber,
		Status:       token.Status,
		Notes:        token.Notes,
		CreatedAt:    token.CreatedAt,
		UpdatedAt:    token.UpdatedAt,
	}, nil
}

func (s *TokenService) GetCurrentToken(branchID uuid.UUID) (*models.TokenResponse, error) {
	token, err := s.tokenRepo.GetCurrentToken(branchID)
	if err != nil {
		return nil, err
	}

	return &models.TokenResponse{
		ID:           token.ID,
		BranchID:     token.BranchID,
		CustomerID:   token.CustomerID,
		AppointmentID: token.AppointmentID,
		TokenNumber:  token.TokenNumber,
		Status:       token.Status,
		Notes:        token.Notes,
		CreatedAt:    token.CreatedAt,
		UpdatedAt:    token.UpdatedAt,
		CalledAt:     token.CalledAt,
	}, nil
}

func (s *TokenService) GetQueueStatus(branchID uuid.UUID) (*models.QueueStatus, error) {
	return s.tokenRepo.GetQueueStatus(branchID)
}

func (s *TokenService) CallNextToken(branchID uuid.UUID) (*models.TokenResponse, error) {
	// Get next waiting token
	token, err := s.tokenRepo.GetNextToken(branchID)
	if err != nil {
		return nil, err
	}

	// Update token status
	now := time.Now()
	token.Status = models.TokenStatusCalled
	token.CalledAt = &now

	if err := s.tokenRepo.Update(token); err != nil {
		return nil, err
	}

	return &models.TokenResponse{
		ID:           token.ID,
		BranchID:     token.BranchID,
		CustomerID:   token.CustomerID,
		AppointmentID: token.AppointmentID,
		TokenNumber:  token.TokenNumber,
		Status:       token.Status,
		Notes:        token.Notes,
		CreatedAt:    token.CreatedAt,
		UpdatedAt:    token.UpdatedAt,
		CalledAt:     token.CalledAt,
	}, nil
}

func (s *TokenService) CompleteToken(id uuid.UUID) error {
	token, err := s.tokenRepo.GetByID(id)
	if err != nil {
		return err
	}

	if token.Status != models.TokenStatusServing {
		return errors.New("token is not in serving status")
	}

	now := time.Now()
	token.Status = models.TokenStatusCompleted
	token.CompletedAt = &now

	return s.tokenRepo.Update(token)
} 