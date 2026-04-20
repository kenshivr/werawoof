package handler

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/kenshivr/werawoof/pkg/sse"
)

type SSEHandler struct {
	broker *sse.Broker
}

func NewSSEHandler(broker *sse.Broker) *SSEHandler {
	return &SSEHandler{broker: broker}
}

// Stream godoc
// @Summary Conectar a notificaciones en tiempo real (SSE)
// @Tags notifications
// @Security BearerAuth
// @Produce text/event-stream
// @Success 200
// @Router /api/notifications [get]
func (h *SSEHandler) Stream(c *gin.Context) {
	userID := mustGetUserID(c)

	ch := h.broker.Subscribe(userID)
	defer h.broker.Unsubscribe(userID)

	c.Writer.Header().Set("Content-Type", "text/event-stream")
	c.Writer.Header().Set("Cache-Control", "no-cache")
	c.Writer.Header().Set("Connection", "keep-alive")
	c.Writer.WriteHeader(http.StatusOK)

	for {
		select {
		case event, ok := <-ch:
			if !ok {
				return
			}
			data, err := json.Marshal(event)
			if err != nil {
				continue
			}
			fmt.Fprintf(c.Writer, "data: %s\n\n", data)
			c.Writer.Flush()
		case <-c.Request.Context().Done():
			return
		}
	}
}
