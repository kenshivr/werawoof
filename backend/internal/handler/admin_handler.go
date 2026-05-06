package handler

import (
	"net/http"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/kenshivr/werawoof/internal/domain"
	"github.com/kenshivr/werawoof/internal/repository"
)

type AdminHandler struct {
	adminRepo *repository.AdminRepository
}

func NewAdminHandler(adminRepo *repository.AdminRepository) *AdminHandler {
	return &AdminHandler{adminRepo: adminRepo}
}

func (h *AdminHandler) GetDashboard(c *gin.Context) {
	users, err := h.adminRepo.GetAllUsers()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to fetch users"})
		return
	}

	visits, err := h.adminRepo.GetPageVisitStats()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to fetch analytics"})
		return
	}

	stats, err := h.adminRepo.GetSummaryStats()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to fetch stats"})
		return
	}

	engagement, err := h.adminRepo.GetEngagementStats()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to fetch engagement"})
		return
	}

	community, err := h.adminRepo.GetCommunityStats(stats.TotalUsers)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to fetch community"})
		return
	}

	growth, err := h.adminRepo.GetGrowthStats()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to fetch growth"})
		return
	}

	locations, err := h.adminRepo.GetTopLocations()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to fetch locations"})
		return
	}

	breeds, err := h.adminRepo.GetTopBreeds()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to fetch breeds"})
		return
	}

	devices, err := h.adminRepo.GetDeviceStats()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to fetch devices"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"users":      users,
		"visits":     visits,
		"stats":      stats,
		"engagement": engagement,
		"community":  community,
		"growth":     growth,
		"locations":  locations,
		"breeds":     breeds,
		"devices":    devices,
	})
}

func (h *AdminHandler) Track(c *gin.Context) {
	var body struct {
		Path string `json:"path"`
	}
	if err := c.ShouldBindJSON(&body); err != nil || strings.TrimSpace(body.Path) == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "path required"})
		return
	}

	v := domain.PageVisit{
		Path:      body.Path,
		IP:        c.ClientIP(),
		UserAgent: c.Request.UserAgent(),
		VisitedAt: time.Now(),
	}
	go func(visit domain.PageVisit) {
		h.adminRepo.SaveVisit(&visit)
	}(v)

	c.JSON(http.StatusOK, gin.H{"ok": true})
}
