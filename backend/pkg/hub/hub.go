package hub

import (
	"encoding/json"
	"log"
	"sync"
	"time"

	"github.com/gorilla/websocket"
)

const (
	writeWait  = 10 * time.Second
	pongWait   = 60 * time.Second
	pingPeriod = (pongWait * 9) / 10
	maxMessage = 512
)

type OutboundMessage struct {
	RecipientID uint
	Payload     any
}

type Client struct {
	UserID uint
	conn   *websocket.Conn
	send   chan []byte
	hub    *Hub
}

type Hub struct {
	mu      sync.RWMutex
	clients map[uint]*Client
	Broadcast chan OutboundMessage
}

func New() *Hub {
	return &Hub{
		clients:   make(map[uint]*Client),
		Broadcast: make(chan OutboundMessage, 256),
	}
}

func (h *Hub) Run() {
	for msg := range h.Broadcast {
		h.mu.RLock()
		client, ok := h.clients[msg.RecipientID]
		h.mu.RUnlock()

		if !ok {
			continue
		}

		data, err := json.Marshal(msg.Payload)
		if err != nil {
			log.Printf("hub: marshal error: %v", err)
			continue
		}

		select {
		case client.send <- data:
		default:
			h.unregister(client)
		}
	}
}

func (h *Hub) Register(userID uint, conn *websocket.Conn) *Client {
	client := &Client{
		UserID: userID,
		conn:   conn,
		send:   make(chan []byte, 256),
		hub:    h,
	}

	h.mu.Lock()
	h.clients[userID] = client
	h.mu.Unlock()

	go client.writePump()
	return client
}

func (h *Hub) unregister(c *Client) {
	h.mu.Lock()
	if _, ok := h.clients[c.UserID]; ok {
		delete(h.clients, c.UserID)
		close(c.send)
	}
	h.mu.Unlock()
}

func (c *Client) ReadPump(onMessage func(data []byte)) {
	defer c.hub.unregister(c)

	c.conn.SetReadLimit(maxMessage)
	c.conn.SetReadDeadline(time.Now().Add(pongWait))
	c.conn.SetPongHandler(func(string) error {
		c.conn.SetReadDeadline(time.Now().Add(pongWait))
		return nil
	})

	for {
		_, data, err := c.conn.ReadMessage()
		if err != nil {
			break
		}
		onMessage(data)
	}
}

func (c *Client) writePump() {
	ticker := time.NewTicker(pingPeriod)
	defer func() {
		ticker.Stop()
		c.conn.Close()
	}()

	for {
		select {
		case data, ok := <-c.send:
			c.conn.SetWriteDeadline(time.Now().Add(writeWait))
			if !ok {
				c.conn.WriteMessage(websocket.CloseMessage, []byte{})
				return
			}
			if err := c.conn.WriteMessage(websocket.TextMessage, data); err != nil {
				return
			}
		case <-ticker.C:
			c.conn.SetWriteDeadline(time.Now().Add(writeWait))
			if err := c.conn.WriteMessage(websocket.PingMessage, nil); err != nil {
				return
			}
		}
	}
}
