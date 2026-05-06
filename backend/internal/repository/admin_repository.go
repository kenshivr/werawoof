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

type EngagementStats struct {
	TotalLikes          int64   `json:"total_likes"`
	TotalDislikes       int64   `json:"total_dislikes"`
	TotalMatches        int64   `json:"total_matches"`
	MatchRate           float64 `json:"match_rate"`
	TotalMessages       int64   `json:"total_messages"`
	MatchesWithMessages int64   `json:"matches_with_messages"`
	GhostMatches        int64   `json:"ghost_matches"`
	AvgMsgsPerMatch     float64 `json:"avg_msgs_per_match"`
}

type CommunityStats struct {
	VerifiedUsers    int64   `json:"verified_users"`
	GoogleUsers      int64   `json:"google_users"`
	UsersWithDogs    int64   `json:"users_with_dogs"`
	ActivationRate   float64 `json:"activation_rate"`
	TotalSubscribers int64   `json:"total_subscribers"`
	TotalReviews     int64   `json:"total_reviews"`
	AvgRating        float64 `json:"avg_rating"`
}

type GrowthPoint struct {
	Week     string `json:"week"`
	NewUsers int64  `json:"new_users"`
}

type LocationStat struct {
	Location string `json:"location"`
	Count    int64  `json:"count"`
}

type BreedStat struct {
	Breed string `json:"breed"`
	Count int64  `json:"count"`
}

type DeviceStats struct {
	MobileVisits  int64   `json:"mobile_visits"`
	DesktopVisits int64   `json:"desktop_visits"`
	MobileRate    float64 `json:"mobile_rate"`
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
	r.db.Raw("SELECT COUNT(DISTINCT ip) FROM page_visits").Scan(&stats.UniqueVisitors)
	return &stats, nil
}

func (r *AdminRepository) GetEngagementStats() (*EngagementStats, error) {
	var stats EngagementStats

	r.db.Raw(`
		SELECT
			COUNT(*) FILTER (WHERE direction = 'like')    AS total_likes,
			COUNT(*) FILTER (WHERE direction = 'dislike') AS total_dislikes
		FROM swipes
	`).Scan(&stats)

	r.db.Model(&domain.Match{}).Count(&stats.TotalMatches)
	r.db.Model(&domain.Message{}).Count(&stats.TotalMessages)
	r.db.Raw("SELECT COUNT(DISTINCT match_id) FROM messages").Scan(&stats.MatchesWithMessages)
	stats.GhostMatches = stats.TotalMatches - stats.MatchesWithMessages

	if stats.TotalLikes > 0 {
		stats.MatchRate = float64(stats.TotalMatches) / float64(stats.TotalLikes) * 100
	}
	if stats.MatchesWithMessages > 0 {
		stats.AvgMsgsPerMatch = float64(stats.TotalMessages) / float64(stats.MatchesWithMessages)
	}

	return &stats, nil
}

func (r *AdminRepository) GetCommunityStats(totalUsers int64) (*CommunityStats, error) {
	var stats CommunityStats

	r.db.Raw(`
		SELECT
			COUNT(*) FILTER (WHERE verified = true)                           AS verified_users,
			COUNT(*) FILTER (WHERE google_id IS NOT NULL AND google_id != '') AS google_users
		FROM users WHERE deleted_at IS NULL
	`).Scan(&stats)

	r.db.Raw("SELECT COUNT(DISTINCT user_id) FROM dogs WHERE deleted_at IS NULL").Scan(&stats.UsersWithDogs)
	r.db.Model(&domain.Subscriber{}).Count(&stats.TotalSubscribers)
	r.db.Model(&domain.Review{}).Count(&stats.TotalReviews)

	if stats.TotalReviews > 0 {
		r.db.Raw("SELECT COALESCE(AVG(rating), 0) FROM reviews").Scan(&stats.AvgRating)
	}
	if totalUsers > 0 {
		stats.ActivationRate = float64(stats.UsersWithDogs) / float64(totalUsers) * 100
	}

	return &stats, nil
}

func (r *AdminRepository) GetGrowthStats() ([]GrowthPoint, error) {
	var points []GrowthPoint
	err := r.db.Raw(`
		SELECT
			TO_CHAR(DATE_TRUNC('week', created_at), 'YYYY-MM-DD') AS week,
			COUNT(*) AS new_users
		FROM users
		WHERE deleted_at IS NULL
		GROUP BY DATE_TRUNC('week', created_at)
		ORDER BY DATE_TRUNC('week', created_at) DESC
		LIMIT 8
	`).Scan(&points).Error
	return points, err
}

func (r *AdminRepository) GetTopLocations() ([]LocationStat, error) {
	var stats []LocationStat
	err := r.db.Raw(`
		SELECT location, COUNT(*) AS count
		FROM users
		WHERE deleted_at IS NULL AND location IS NOT NULL AND location != ''
		GROUP BY location
		ORDER BY count DESC
		LIMIT 10
	`).Scan(&stats).Error
	return stats, err
}

func (r *AdminRepository) GetTopBreeds() ([]BreedStat, error) {
	var stats []BreedStat
	err := r.db.Raw(`
		SELECT breed, COUNT(*) AS count
		FROM dogs
		WHERE deleted_at IS NULL AND breed IS NOT NULL AND breed != ''
		GROUP BY breed
		ORDER BY count DESC
		LIMIT 10
	`).Scan(&stats).Error
	return stats, err
}

func (r *AdminRepository) GetDeviceStats() (*DeviceStats, error) {
	var stats DeviceStats
	err := r.db.Raw(`
		SELECT
			COUNT(*) FILTER (WHERE
				user_agent ILIKE '%mobile%' OR
				user_agent ILIKE '%android%' OR
				user_agent ILIKE '%iphone%'  OR
				user_agent ILIKE '%ipad%'
			) AS mobile_visits,
			COUNT(*) FILTER (WHERE NOT (
				user_agent ILIKE '%mobile%' OR
				user_agent ILIKE '%android%' OR
				user_agent ILIKE '%iphone%'  OR
				user_agent ILIKE '%ipad%'
			)) AS desktop_visits
		FROM page_visits
	`).Scan(&stats).Error
	if err != nil {
		return &stats, err
	}
	total := stats.MobileVisits + stats.DesktopVisits
	if total > 0 {
		stats.MobileRate = float64(stats.MobileVisits) / float64(total) * 100
	}
	return &stats, nil
}

func (r *AdminRepository) SaveVisit(visit *domain.PageVisit) {
	r.db.Create(visit)
}
