# Decisiones de arquitectura (ADRs)

Registro de las decisiones que definieron WeraWoof: qué se decidió, en qué contexto y qué
se sacrificó a cambio. Cada ADR es corto a propósito — el detalle vive en el código.

| #    | Decisión                                                                           | Estado   |
| ---- | ---------------------------------------------------------------------------------- | -------- |
| 0001 | [Supabase en vez de un backend propio](0001-supabase-en-vez-de-backend-propio.md)  | Aceptada |
| 0002 | [Las reglas de negocio viven en Postgres](0002-reglas-de-negocio-en-postgres.md)   | Aceptada |
| 0003 | [Server routes solo donde hay un secreto](0003-server-routes-solo-con-secretos.md) | Aceptada |
| 0004 | [Correo por una cuenta de Gmail dedicada](0004-correo-por-gmail-dedicado.md)       | Aceptada |
| 0005 | [`frontend/` se queda como subcarpeta](0005-frontend-como-subcarpeta.md)           | Aceptada |
| 0006 | [Tests de las server routes sin levantar Nuxt](0006-tests-sin-nuxt.md)             | Aceptada |
| 0007 | [Dominio propio comprado y servido en Vercel](0007-dominio-en-vercel.md)           | Aceptada |

También hay un [postmortem del día del cutover](../postmortem-2026-09-06-cutover.md): el bug de
los claims del JWT y las tres horas de 500 en producción.
