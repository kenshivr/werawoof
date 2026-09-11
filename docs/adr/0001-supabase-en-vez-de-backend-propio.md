# ADR 0001 — Supabase en vez de un backend propio

- **Fecha**: 2026-08-31
- **Estado**: Aceptada

## Contexto

WeraWoof nació en abril de 2026 con un backend propio en Go + Gin: PostgreSQL para los datos,
Redis para sesiones, tokens de verificación y el chat, un hub de WebSockets (más SSE) para los
mensajes en tiempo real, Cloudinary para las fotos y un JWT propio para la autenticación. Todo
eso corría en Railway, con el frontend Nuxt aparte.

En agosto de 2026 el trial de Railway venció y el backend murió: la app pública seguía en línea,
pero todo lo que había detrás del login devolvía "Application not found". Las opciones eran
pagar Railway, mover el Go a un VPS o dejar de tener backend. DiNelo, del mismo autor, ya corría
sobre Supabase + Vercel con Row Level Security y sin servidor propio.

## Decisión

**Reemplazar el backend completo por Supabase y dejar un solo proyecto Nuxt 3 en Vercel.**
Postgres con RLS sustituye a la API; Supabase Auth al JWT + Redis; Realtime a los WebSockets;
Storage a Cloudinary. El navegador habla directo con Supabase usando la sesión del usuario.

La migración se hizo en cuatro fases (esquema y auth, datos, chat, server routes) durante la
primera semana de septiembre. El código Go no se conservó en una rama ni con un tag: sigue en
la historia de git hasta el commit `4033595` y se retiró en `5adf660`. Las cuentas de la era
Go no se migraron; los usuarios volvieron a registrarse.

## Consecuencias

- ✅ Cero servidores que mantener y cero costo fijo: el proyecto vive en los planes gratuitos
  de Supabase y Vercel.
- ✅ Registro, confirmación por correo, Google OAuth y restablecer contraseña vienen resueltos;
  el commit que retiró el Go borró 5,667 líneas.
- ✅ Chat en tiempo real con `postgres_changes`, sin hub ni reconexión manual.
- ⚠️ El plan gratuito de Supabase pausa el proyecto tras una semana sin actividad y no incluye
  backups: hay que restaurarlo desde el dashboard si eso pasa.
- ⚠️ El navegador tiene la anon key. La seguridad depende por completo de las políticas RLS
  (ADR 0002); no hay una capa de API que tape un descuido.
- ⚠️ Acoplamiento a `supabase-js`, Realtime y Storage. Los datos son Postgres puro
  (`pg_dump` funciona), pero Auth, Realtime y Storage tendrían que reemplazarse si el proyecto
  se mudara.
- ⚠️ El módulo de Nuxt crea el cliente de Supabase en todas las páginas, así que la landing
  descarga `supabase-js` entero (unos 160 KB comprimidos, más de la mitad sin usar ahí).
  Se aceptó: la landing rinde 99 en móvil y 100 en escritorio con Lighthouse, y sacarlo
  del chunk de entrada implica reemplazar el módulo por un cliente propio cargado bajo
  demanda. Se revisa si la landing se vuelve una prioridad de marketing.
