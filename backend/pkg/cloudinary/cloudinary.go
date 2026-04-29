package cloudinary

import (
	"context"
	"fmt"
	"mime/multipart"

	"github.com/cloudinary/cloudinary-go/v2"
	"github.com/cloudinary/cloudinary-go/v2/api/uploader"
)

type Client struct {
	cld        *cloudinary.Cloudinary
	folder     string
	configured bool
}

func New(cloudName, apiKey, apiSecret, folder string) (*Client, error) {
	configured := cloudName != "" && apiKey != "" && apiSecret != ""
	cld, err := cloudinary.NewFromParams(cloudName, apiKey, apiSecret)
	if err != nil {
		return nil, fmt.Errorf("cloudinary init failed: %w", err)
	}
	return &Client{cld: cld, folder: folder, configured: configured}, nil
}

func (c *Client) IsConfigured() bool {
	return c.configured
}

func (c *Client) UploadImage(ctx context.Context, file multipart.File) (string, error) {
	resp, err := c.cld.Upload.Upload(ctx, file, uploader.UploadParams{
		Folder: c.folder,
	})
	if err != nil {
		return "", fmt.Errorf("cloudinary upload failed: %w", err)
	}
	return resp.SecureURL, nil
}

func (c *Client) DeleteImage(ctx context.Context, publicID string) error {
	_, err := c.cld.Upload.Destroy(ctx, uploader.DestroyParams{
		PublicID: publicID,
	})
	return err
}
