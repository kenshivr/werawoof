package redis

import (
	"context"
	"time"
)

func (c *Client) BlacklistToken(ctx context.Context, token string, ttl time.Duration) error {
	return c.rdb.Set(ctx, "blacklist:"+token, "1", ttl).Err()
}

func (c *Client) IsTokenBlacklisted(ctx context.Context, token string) (bool, error) {
	exists, err := c.rdb.Exists(ctx, "blacklist:"+token).Result()
	if err != nil {
		return false, err
	}
	return exists == 1, nil
}
