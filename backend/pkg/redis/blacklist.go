package redis

import (
	"context"
	"fmt"
	"time"
)

func (c *Client) SetChatEmailSent(ctx context.Context, matchID, recipientID uint) error {
	key := fmt.Sprintf("email:chat:%d:%d", matchID, recipientID)
	return c.rdb.Set(ctx, key, "1", 24*time.Hour).Err()
}

func (c *Client) IsChatEmailSent(ctx context.Context, matchID, recipientID uint) (bool, error) {
	key := fmt.Sprintf("email:chat:%d:%d", matchID, recipientID)
	exists, err := c.rdb.Exists(ctx, key).Result()
	if err != nil {
		return false, err
	}
	return exists == 1, nil
}

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
