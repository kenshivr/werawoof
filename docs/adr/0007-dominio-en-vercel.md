# ADR 0007 — Dominio propio comprado y servido en Vercel

- **Fecha**: 2026-09-11
- **Estado**: Aceptada

## Contexto

Desde el cutover la app vivía en `werawoof.vercel.app`: funcional, pero un subdominio
prestado no sirve para compartir, para el correo ni para la pantalla de consentimiento de
Google. Se compararon registradores para `werawoof.com` (Cloudflare, Porkbun, Spaceship,
Namecheap y Vercel): la diferencia entre el más barato y Vercel era de un dólar al año, y el
precio de los `.com` sube cada año hasta 2030.

## Decisión

**Comprar `werawoof.com` en Vercel y servirlo desde el mismo proyecto.** Cero configuración
de DNS, WHOIS privado y certificado automático. `werawoof.com` es la única URL canónica:
`www.werawoof.com` y `werawoof.vercel.app` redirigen con 308 al apex, Supabase Auth tiene el
dominio como Site URL y en las Redirect URLs, y todas las URLs públicas del código (`og:url`,
`llms.txt`, correo de bienvenida, README) apuntan a él.

## Consecuencias

- ✅ Una sola URL para SEO, para compartir y para las tarjetas de Open Graph.
- ✅ Los enlaces viejos a `vercel.app` siguen funcionando: redirigen.
- ⚠️ El registrador es el mismo proveedor que el hosting. Si Vercel dejara de convenir, el
  dominio es transferible tras los 60 días que exige ICANN.
- ⚠️ Vercel **no** agrega `www` al asignar el apex: hasta agregarlo como redirect, `www`
  servía el certificado del apex y el navegador mostraba error.
- ⚠️ La PWA instalada desde `vercel.app` queda fuera de su scope tras el redirect: hay que
  reinstalarla desde el dominio, y la sesión de Supabase no cruza de origen.
- ⚠️ La pantalla de consentimiento de Google sigue diciendo `supabase.co`: el custom domain
  de Supabase cuesta aparte y quedó diferido.
