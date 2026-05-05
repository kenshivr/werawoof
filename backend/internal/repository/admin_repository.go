package repository

import (
	"time"

	"github.com/kenshivr/werawoof/internal/domain"
	"gorm.io/gorm"
)

type AdminRepository struct {
	db *gorm.DB
}

func NewAdminRepository(db *gorm.DB) *AdminRepository {
	return &AdminRepository{db: db}
}

type PageVisitStat struct {
	Path        string    `json:"path"`
	TotalVisits int64     `json:"total_visits"`
	UniqueIPs   int64     `json:"unique_ips"`
	LastVisitAt time.Time `json:"last_visit_at"`
}

type SummaryStats struct {
	TotalUsers     int64 `json:"total_users"`
	TotalDogs      int64 `json:"total_dogs"`
	TotalVisits    int64 `json:"total_visits"`
	UniqueVisitors int64 `json:"unique_visitors"`
}

func (r *AdminRepository) GetAllUsers() ([]domain.User, error) {
	var users []domain.User
	err := r.db.Preload("Dogs").Order("created_at DESC").Find(&users).Error
	return users, err
}

func (r *AdminRepository) GetPageVisitStats() ([]PageVisitStat, error) {
	var stats []PageVisitStat
	err := r.db.Raw(`
		SELECT
			path,
			COUNT(*) AS total_visits,
			COUNT(DISTINCT ip) AS unique_ips,
			MAX(visited_at) AS last_visit_at
		FROM page_visits
		GROUP BY path
		ORDER BY total_visits DESC
	`).Scan(&stats).Error
	return stats, err
}

func (r *AdminRepository) GetSummaryStats() (*SummaryStats, error) {
	var stats SummaryStats
	r.db.Model(&domain.User{}).Count(&stats.TotalUsers)
	r.db.Model(&domain.Dog{}).Count(&stats.TotalDogs)
	r.db.Model(&domain.PageVisit{}).Count(&stats.TotalVisits)
	var uniqueCount int64
	r.db.Raw("SELECT COUNT(DISTINCT ip) FROM page_visits").Scan(&uniqueCount)
	stats.UniqueVisitors = uniqueCount
	return &stats, nil
}

func (r *AdminRepository) SaveVisit(visit *domain.PageVisit) {
	r.db.Create(visit)
}
