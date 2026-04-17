package service

import (
	"fmt"

	"github.com/resend/resend-go/v2"
)

type EmailService struct {
	client    *resend.Client
	fromEmail string
	appURL    string
}

func NewEmailService(apiKey, fromEmail, appURL string) *EmailService {
	return &EmailService{
		client:    resend.NewClient(apiKey),
		fromEmail: fromEmail,
		appURL:    appURL,
	}
}

func (s *EmailService) SendVerification(toEmail, name, token string) error {
	link := fmt.Sprintf("%s/verify?token=%s", s.appURL, token)

	_, err := s.client.Emails.Send(&resend.SendEmailRequest{
		From:    s.fromEmail,
		To:      []string{toEmail},
		Subject: "Verificá tu cuenta en WeraWoof",
		Html: fmt.Sprintf(`
			<h2>Hola %s!</h2>
			<p>Gracias por registrarte en WeraWoof.</p>
			<p>Hacé click en el botón para verificar tu cuenta:</p>
			<a href="%s" style="background:#f97316;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;">
				Verificar cuenta
			</a>
			<p>Este link expira en 24 horas.</p>
		`, name, link),
	})

	return err
}

func (s *EmailService) SendPasswordReset(toEmail, name, token string) error {
	link := fmt.Sprintf("%s/reset-password?token=%s", s.appURL, token)

	_, err := s.client.Emails.Send(&resend.SendEmailRequest{
		From:    s.fromEmail,
		To:      []string{toEmail},
		Subject: "Resetear contraseña — WeraWoof",
		Html: fmt.Sprintf(`
			<h2>Hola %s!</h2>
			<p>Recibimos una solicitud para resetear tu contraseña.</p>
			<p>Hacé click en el botón para continuar:</p>
			<a href="%s" style="background:#f97316;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;">
				Resetear contraseña
			</a>
			<p>Este link expira en 1 hora. Si no pediste esto, ignorá este email.</p>
		`, name, link),
	})

	return err
}
