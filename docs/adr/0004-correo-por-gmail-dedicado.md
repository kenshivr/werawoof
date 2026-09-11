# ADR 0004 — Correo por una cuenta de Gmail dedicada

- **Fecha**: 2026-09-07
- **Estado**: Aceptada (revisar ahora que existe werawoof.com)

## Contexto

El SMTP integrado de Supabase manda unos pocos correos por hora y solo a miembros del
proyecto: con eso ningún usuario real puede confirmar su registro. Brevo, que el backend Go
tenía configurado, nunca llegó a funcionar. Y en ese momento la app vivía en
`werawoof.vercel.app`, sin dominio propio: Brevo aporta SPF/DKIM de **tu** dominio, así que
mandar desde una cuenta `@gmail.com` a través de Brevo alinea peor que mandar por Gmail
directo.

Vercel deja salir tráfico SMTP por los puertos 465 y 587 (bloquea el 25). Gmail permite
alrededor de 500 correos por día por cuenta.

## Decisión

**Una cuenta de Gmail dedicada a WeraWoof, con 2FA y App Password, como SMTP para todo**:
el custom SMTP de Supabase Auth (confirmación, restablecer contraseña) y las server routes
(contacto, bienvenida al newsletter, avisos internos) a través de `nodemailer` por
`smtp.gmail.com:465`. La misma cuenta es la bandeja que recibe el formulario de contacto.

## Consecuencias

- ✅ Entrega inmediata y gratuita, sin el límite por hora ni la restricción a miembros del
  proyecto del SMTP por defecto.
- ✅ Una sola bandeja para enviar y recibir; el correo personal del autor salió del código.
- ⚠️ Tope de ~500 correos por día. Suficiente hoy; no para una campaña.
- ⚠️ El App Password es un secreto más que vive en Vercel y en Supabase.
- ⚠️ Desde el 2026-09-11 la app tiene dominio propio (ADR 0007): un proveedor transaccional
  con SPF/DKIM de `werawoof.com` vuelve a ser viable. Esta decisión se revisa cuando el
  volumen o la reputación lo pidan.
