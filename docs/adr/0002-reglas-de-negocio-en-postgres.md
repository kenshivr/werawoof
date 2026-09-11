# ADR 0002 — Las reglas de negocio viven en Postgres

- **Fecha**: 2026-08-31
- **Estado**: Aceptada

## Contexto

Sin backend propio (ADR 0001), el navegador escribe directo en la base. Si las reglas
("un match existe cuando los dos perros se dieron like", "solo swipeás con un perro tuyo",
"nadie se vuelve admin solo") vivieran en el código de la app, cualquiera con la anon key y
la consola del navegador podría saltárselas.

## Decisión

**Las reglas se implementan en Postgres: políticas RLS, triggers y funciones.** La app solo
lee y escribe filas; la base decide qué es válido.

- Toda tabla tiene RLS. Un usuario logueado lee todos los perfiles y perros (los necesita para
  los candidatos y los matches) pero solo escribe sus propias filas.
- `handle_new_user` crea el perfil al registrarse; `handle_swipe` crea el match cuando el like
  es recíproco. Los clientes **no pueden insertar** en `profiles` ni en `matches`.
- La política de `swipes` valida que el perro que swipea sea tuyo y el swipeado no.
- La columna `role` no es escribible por usuarios: el `update` se concede por columna.
- Los datos públicos salen por funciones `security definer` (`get_reviews`,
  `get_admin_dashboard`) que devuelven exactamente los campos que la página necesita.
- Realtime publica `messages` y `matches`; las políticas de `select` deciden qué recibe cada
  cliente.

## Consecuencias

- ✅ Un `where` olvidado en la app devuelve vacío, no datos ajenos.
- ✅ El match se crea dentro de la transacción del segundo like: sin carreras ni doble match.
- ✅ Las páginas públicas no exponen tablas: exponen una función con forma fija.
- ⚠️ Las políticas se prueban corriendo la base, no con el typechecker. El esquema completo
  está versionado en `supabase/schema.sql` más archivos aditivos (`002`, `003`, `004`) que se
  corren una sola vez y a mano en el SQL Editor; no hay herramienta de migraciones.
- ⚠️ Cada cambio de esquema exige regenerar `frontend/types/database.types.ts`.
- ⚠️ Debuggear "no veo datos" implica pensar en dos capas: la query y la política.
