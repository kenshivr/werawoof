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

func (s *EmailService) SendContact(name, phone, fromEmail, message string) error {
	phoneLine := ""
	if phone != "" {
		phoneLine = fmt.Sprintf("<p><strong>Teléfono:</strong> %s</p>", phone)
	}

	_, err := s.client.Emails.Send(&resend.SendEmailRequest{
		From:    s.fromEmail,
		To:      []string{"vidal.fullstack@gmail.com"},
		ReplyTo: fromEmail,
		Subject: fmt.Sprintf("Nuevo mensaje de contacto de %s — WeraWoof", name),
		Html: fmt.Sprintf(`
			<div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px">
				<h2 style="color:#382615">📬 Nuevo mensaje de contacto</h2>
				<div style="background:#DBD8D0;border-radius:12px;padding:20px;margin:16px 0">
					<p><strong>Nombre:</strong> %s</p>
					%s
					<p><strong>Correo:</strong> <a href="mailto:%s">%s</a></p>
					<hr style="border:none;border-top:1px solid #B78F64;margin:16px 0"/>
					<p><strong>Mensaje:</strong></p>
					<p style="white-space:pre-wrap">%s</p>
				</div>
				<p style="color:#7d571e;font-size:12px">Enviado desde el formulario de contacto de WeraWoof</p>
			</div>
		`, name, phoneLine, fromEmail, fromEmail, message),
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
