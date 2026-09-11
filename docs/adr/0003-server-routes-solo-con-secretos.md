# ADR 0003 — Server routes solo donde hay un secreto

- **Fecha**: 2026-09-07
- **Estado**: Aceptada

## Contexto

Cuatro cosas no pueden hacerse desde el navegador con la anon key: mandar correo (las
credenciales SMTP son secretas), registrar visitas anónimas y suscripciones sin que cualquiera
pueda inflarlas, y borrar una cuenta (la Auth admin API exige la secret key). En el backend Go
esto era la mitad del servidor.

## Decisión

**Rutas de Nitro solo para las acciones que necesitan un secreto; todo lo demás va directo a
Supabase.** Son cuatro: `POST /api/contact`, `POST /api/newsletter`, `POST /api/track` y
`DELETE /api/account`. La secret key y las credenciales SMTP viven en `runtimeConfig` y solo
se leen dentro de esas rutas.

Como consecuencia, las políticas que permitían `insert` anónimo en `subscribers` y
`page_visits` se retiraron (`supabase/004_drop_anon_policies.sql`, 2026-09-09): la única vía
de escritura es el servidor con la secret key.

## Consecuencias

- ✅ Ni la secret key ni el App Password de Gmail llegan al cliente.
- ✅ Nadie puede insertar suscriptores o visitas falsas con la anon key.
- ✅ El "backend" cabe en cuatro archivos y un helper de correo: es lo único que necesita
  tests de servidor (ADR 0006).
- ⚠️ Nitro corre serverless en Vercel: el transporte SMTP se cachea por instancia, no de forma
  global, y cada ruta debe fallar cerrado si faltan las variables de entorno.
- ⚠️ El borrado de cuenta depende de la cascada de la base (perfil, perros, swipes, matches y
  mensajes): un `on delete` mal puesto deja huérfanos.
