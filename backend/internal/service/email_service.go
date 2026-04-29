package service

import (
	"fmt"

	"gopkg.in/gomail.v2"
)

type EmailService struct {
	user      string
	password  string
	fromEmail string
	appURL    string
}

func NewEmailService(user, password, fromEmail, appURL string) *EmailService {
	return &EmailService{
		user:      user,
		password:  password,
		fromEmail: fromEmail,
		appURL:    appURL,
	}
}

func (s *EmailService) send(to, replyTo, subject, html string) error {
	m := gomail.NewMessage()
	m.SetHeader("From", s.fromEmail)
	m.SetHeader("To", to)
	if replyTo != "" {
		m.SetHeader("Reply-To", replyTo)
	}
	m.SetHeader("Subject", subject)
	m.SetBody("text/html", html)

	d := gomail.NewDialer("smtp.gmail.com", 587, s.user, s.password)
	return d.DialAndSend(m)
}

func (s *EmailService) SendVerification(toEmail, name, token string) error {
	link := fmt.Sprintf("%s/verify?token=%s", s.appURL, token)
	html := fmt.Sprintf(`
		<div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px">
			<h2 style="color:#382615">¡Hola %s!</h2>
			<p>Gracias por registrarte en WeraWoof.</p>
			<p>Hacé click en el botón para verificar tu cuenta:</p>
			<a href="%s" style="display:inline-block;background:#F4C07D;color:#382615;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:bold;">
				Verificar cuenta
			</a>
			<p style="color:#7d571e;font-size:12px;margin-top:24px">Este link expira en 24 horas.</p>
		</div>
	`, name, link)
	return s.send(toEmail, "", "Verificá tu cuenta en WeraWoof", html)
}

func (s *EmailService) SendContact(name, phone, fromEmail, message string) error {
	phoneLine := ""
	if phone != "" {
		phoneLine = fmt.Sprintf("<p><strong>Teléfono:</strong> %s</p>", phone)
	}
	html := fmt.Sprintf(`
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
	`, name, phoneLine, fromEmail, fromEmail, message)
	return s.send("vidal.fullstack@gmail.com", fromEmail, fmt.Sprintf("Nuevo mensaje de %s — WeraWoof", name), html)
}

func (s *EmailService) SendNewsletterNotification(subscriberEmail string) error {
	html := fmt.Sprintf(`
		<div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px">
			<h2 style="color:#382615">📧 Nuevo suscriptor al newsletter</h2>
			<div style="background:#DBD8D0;border-radius:12px;padding:20px;margin:16px 0">
				<p><strong>Correo:</strong> <a href="mailto:%s">%s</a></p>
				<p><strong>Fuente:</strong> Footer de WeraWoof</p>
			</div>
			<p style="color:#7d571e;font-size:12px">Enviado desde el formulario de newsletter de WeraWoof</p>
		</div>
	`, subscriberEmail, subscriberEmail)
	return s.send("vidal.fullstack@gmail.com", subscriberEmail, fmt.Sprintf("Nuevo suscriptor: %s — WeraWoof", subscriberEmail), html)
}

func (s *EmailService) SendPasswordReset(toEmail, name, token string) error {
	link := fmt.Sprintf("%s/reset-password?token=%s", s.appURL, token)
	html := fmt.Sprintf(`
		<div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px">
			<h2 style="color:#382615">¡Hola %s!</h2>
			<p>Recibimos una solicitud para resetear tu contraseña.</p>
			<p>Hacé click en el botón para continuar:</p>
			<a href="%s" style="display:inline-block;background:#F4C07D;color:#382615;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:bold;">
				Resetear contraseña
			</a>
			<p style="color:#7d571e;font-size:12px;margin-top:24px">Este link expira en 1 hora. Si no pediste esto, ignorá este email.</p>
		</div>
	`, name, link)
	return s.send(toEmail, "", "Resetear contraseña — WeraWoof", html)
}
