package sse

import "sync"

type Event struct {
	Type string `json:"type"`
	Data any    `json:"data"`
}

type Broker struct {
	mu      sync.RWMutex
	clients map[uint]chan Event
}

func New() *Broker {
	return &Broker{clients: make(map[uint]chan Event)}
}

func (b *Broker) Subscribe(userID uint) chan Event {
	ch := make(chan Event, 8)
	b.mu.Lock()
	b.clients[userID] = ch
	b.mu.Unlock()
	return ch
}

func (b *Broker) Unsubscribe(userID uint) {
	b.mu.Lock()
	if ch, ok := b.clients[userID]; ok {
		delete(b.clients, userID)
		close(ch)
	}
	b.mu.Unlock()
}

func (b *Broker) Send(userID uint, event Event) {
	b.mu.RLock()
	ch, ok := b.clients[userID]
	b.mu.RUnlock()
	if ok {
		select {
		case ch <- event:
		default:
		}
	}
}
