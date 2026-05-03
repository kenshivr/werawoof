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

type MatchEmailData struct {
	RecipientEmail string
	MyDogName      string
	MyOwnerName    string
	OtherDogName   string
	OtherDogBreed  string
	OtherDogAge    int
	OtherDogPhoto  string
	OtherDogTags   []string
	OtherOwnerName string
}

func (s *EmailService) SendMatch(data MatchEmailData) error {
	photoHTML := ""
	if data.OtherDogPhoto != "" {
		photoHTML = fmt.Sprintf(`
			<div style="text-align:center;margin:24px 0 8px">
				<img src="%s" alt="%s"
					style="width:180px;height:180px;border-radius:50%%;object-fit:cover;border:4px solid #F4C07D;display:inline-block;box-shadow:0 4px 16px rgba(56,38,21,0.15)" />
			</div>`, data.OtherDogPhoto, data.OtherDogName)
	}

	tagsHTML := ""
	for _, tag := range data.OtherDogTags {
		tagsHTML += fmt.Sprintf(
			`<span style="display:inline-block;background:#FEF3E2;color:#382615;border:1px solid #F4C07D;border-radius:20px;padding:3px 11px;font-size:12px;font-weight:600;margin:3px 2px">%s</span>`,
			tag,
		)
	}
	if tagsHTML != "" {
		tagsHTML = `<p style="margin:14px 0 6px;color:#713E18;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.8px">Personalidad</p><div>` + tagsHTML + `</div>`
	}

	ageText := fmt.Sprintf("%d año", data.OtherDogAge)
	if data.OtherDogAge != 1 {
		ageText += "s"
	}

	matchesURL := fmt.Sprintf("%s/app/matches", s.appURL)

	html := fmt.Sprintf(`<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f0ebe4;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif">
<div style="max-width:560px;margin:0 auto;padding:28px 16px">

  <!-- Header -->
  <div style="background:#382615;border-radius:16px 16px 0 0;padding:22px 32px;text-align:center">
    <span style="font-size:26px">🐾</span>
    <span style="color:#F4C07D;font-size:20px;font-weight:800;letter-spacing:-0.3px;margin-left:8px;vertical-align:middle">WeraWoof</span>
  </div>

  <!-- Body -->
  <div style="background:#ffffff;padding:36px 32px;border-left:1px solid #e5ddd4;border-right:1px solid #e5ddd4">

    <p style="margin:0 0 4px;color:#B78F64;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1.2px">¡Es oficial!</p>
    <h1 style="margin:0 0 12px;color:#382615;font-size:26px;font-weight:800;line-height:1.2">
      Tuviste un match, %s 🎉
    </h1>
    <p style="margin:0 0 4px;color:#5a4030;font-size:15px;line-height:1.6">
      <strong>%s</strong> y <strong>%s</strong> se gustaron mutuamente.<br>
      Ya podés empezar a hablar con <strong>%s</strong> y organizar el primer encuentro.
    </p>

    %s

    <!-- Card del otro perro -->
    <div style="background:#fdf8f2;border:1px solid #e8d8c0;border-radius:14px;padding:22px 24px;margin:24px 0 0">
      <p style="margin:0 0 16px;color:#382615;font-size:15px;font-weight:700;line-height:1.3">
        %s
        <span style="display:block;color:#B78F64;font-size:13px;font-weight:400;margin-top:2px">Dueño/a: %s</span>
      </p>

      <div style="display:grid;gap:8px">
        <div style="display:flex;gap:8px;align-items:baseline">
          <span style="color:#8a6a50;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.6px;min-width:52px">Raza</span>
          <span style="color:#382615;font-size:14px;font-weight:600">%s</span>
        </div>
        <div style="display:flex;gap:8px;align-items:baseline">
          <span style="color:#8a6a50;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.6px;min-width:52px">Edad</span>
          <span style="color:#382615;font-size:14px;font-weight:600">%s</span>
        </div>
      </div>

      %s
    </div>

    <!-- CTA -->
    <div style="text-align:center;margin:32px 0 4px">
      <a href="%s"
        style="display:inline-block;background:#F4C07D;color:#382615;text-decoration:none;font-weight:700;font-size:15px;padding:14px 40px;border-radius:12px;letter-spacing:0.2px;box-shadow:0 4px 12px rgba(244,192,125,0.4)">
        Ver mi match →
      </a>
    </div>

  </div>

  <!-- Footer -->
  <div style="background:#382615;border-radius:0 0 16px 16px;padding:18px 32px;text-align:center">
    <p style="margin:0;color:#B78F64;font-size:12px;font-style:italic">Conectá patitas, creá recuerdos. 🐾</p>
    <p style="margin:6px 0 0;color:#6b4a2a;font-size:11px">WeraWoof · este correo fue enviado automáticamente</p>
  </div>

</div>
</body>
</html>`,
		data.MyOwnerName,
		data.MyDogName, data.OtherDogName,
		data.OtherOwnerName,
		photoHTML,
		data.OtherDogName,
		data.OtherOwnerName,
		data.OtherDogBreed,
		ageText,
		tagsHTML,
		matchesURL,
	)

	subject := fmt.Sprintf("🐾 ¡%s y %s hicieron match en WeraWoof!", data.MyDogName, data.OtherDogName)
	return s.send(data.RecipientEmail, "", subject, html)
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
