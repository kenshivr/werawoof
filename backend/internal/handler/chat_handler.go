package handler

import (
	"encoding/json"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
	"github.com/kenshivr/werawoof/internal/service"
	"github.com/kenshivr/werawoof/pkg/hub"
)

type ChatHandler struct {
	chatService    *service.ChatService
	hub            *hub.Hub
	upgrader       websocket.Upgrader
}

func NewChatHandler(chatService *service.ChatService, h *hub.Hub, allowedOrigins []string) *ChatHandler {
	originSet := make(map[string]struct{}, len(allowedOrigins))
	for _, o := range allowedOrigins {
		originSet[o] = struct{}{}
	}

	upgrader := websocket.Upgrader{
		CheckOrigin: func(r *http.Request) bool {
			origin := r.Header.Get("Origin")
			_, ok := originSet[origin]
			return ok
		},
	}

	return &ChatHandler{
		chatService: chatService,
		hub:         h,
		upgrader:    upgrader,
	}
}

func (h *ChatHandler) Connect(c *gin.Context) {
	userID := mustGetUserID(c)

	conn, err := h.upgrader.Upgrade(c.Writer, c.Request, nil)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "websocket upgrade failed"})
		return
	}

	client := h.hub.Register(userID, conn)

	client.ReadPump(func(data []byte) {
		var req struct {
			MatchID uint   `json:"match_id"`
			Content string `json:"content"`
		}
		if err := json.Unmarshal(data, &req); err != nil || req.MatchID == 0 || req.Content == "" {
			return
		}
		h.chatService.SendMessage(req.MatchID, userID, req.Content)
	})
}

// GetHistory godoc
// @Summary Obtener historial de mensajes de un match
// @Tags chat
// @Security BearerAuth
// @Produce json
// @Param match_id path int true "Match ID"
// @Success 200 {object} map[string]any
// @Router /api/matches/{match_id}/messages [get]
func (h *ChatHandler) GetHistory(c *gin.Context) {
	userID := mustGetUserID(c)

	matchID, err := strconv.ParseUint(c.Param("match_id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid match_id"})
		return
	}

	messages, err := h.chatService.GetHistory(uint(matchID), userID)
	if err != nil {
		if err.Error() == "forbidden" {
			c.JSON(http.StatusForbidden, gin.H{"error": "forbidden"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "could not fetch messages"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"messages": messages})
}
