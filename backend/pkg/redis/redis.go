package redis

import (
	"context"
	"fmt"

	"github.com/redis/go-redis/v9"
)

type Client struct {
	rdb *redis.Client
}

func Connect(url string) (*Client, error) {
	opts, err := redis.ParseURL(url)
	if err != nil {
		return nil, fmt.Errorf("invalid redis url: %w", err)
	}

	rdb := redis.NewClient(opts)

	if err := rdb.Ping(context.Background()).Err(); err != nil {
		return nil, fmt.Errorf("redis connection failed: %w", err)
	}

	return &Client{rdb: rdb}, nil
}

func (c *Client) Raw() *redis.Client {
	return c.rdb
}
