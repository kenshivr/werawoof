# Postmortem — El día del cutover (6 de septiembre de 2026)

- **Fecha del incidente**: 2026-09-06
- **Impacto**: la app pública devolvió 500 en todas las rutas durante unas tres horas. No
  había usuarios activos: el backend Go llevaba semanas muerto (ADR 0001). Antes, en
  desarrollo, un bug de fondo impedía guardar perfil, perros y reseñas; se atrapó antes de
  llegar a producción.
- **Estado**: resuelto el mismo día; producción validada con registro, perfil con avatar y
  perro con foto.

Fueron dos incidentes distintos en el mismo día, y vale la pena contarlos separados.

## Incidente A — "No se pudo guardar", con la pestaña Network vacía

### Qué se vio

Al probar en desarrollo el paso 3 de la migración (perros y reseñas sobre Supabase), guardar
el perfil, crear un perro o dejar una reseña fallaba con **"No se pudo guardar"**. Lo raro:
en la pestaña Network **no salía ningún request**. El error no venía de la base.

### Qué pasó de verdad

1. En `@nuxtjs/supabase` 2.x, `useSupabaseUser()` **ya no devuelve el `User`**: devuelve los
   _claims_ del JWT (`auth.getClaims()`). El id del usuario vive en `sub`; no existen `id`,
   `created_at` ni `email_confirmed_at`.
2. El tipo de los claims (`JwtPayload`) tiene una firma de índice `[key: string]: any`, así que
   `supabaseUser.value.id` **compilaba sin error** y en runtime era `undefined`.
3. El helper `uid()` del store de perros lanzaba "No hay sesión activa" **antes** de llamar a
   `supabase-js`: por eso Network estaba vacío. `fetchProfile` pedía `id=eq.undefined` y el
   400 lo tragaba un `catch` del plugin; el nombre del perfil salía de `user_metadata`, lo que
   disimulaba que el perfil nunca cargaba.
4. En el servidor pasaba lo mismo: `serverSupabaseUser(event)` también devuelve claims, y el
   borrado de cuenta llamaba a `deleteUser(undefined)`.

¿Por qué no se vio antes? El 2 de septiembre solo se probó auth (registro, login, logout),
que no usa `.id`. Perros y chat todavía iban al API Go. El bug existía desde el primer commit
de la migración y nadie lo había ejercitado.

### Fix (`b74101c`)

- **El store de auth es el único que sabe leer claims.** Expone `uid` (= `sub`) y un `user`
  armado desde `sub`, `email` y `user_metadata`; el resto de la app usa `auth.uid` y
  `auth.user`.
- El store de perros dejó de llamar a `useSupabaseUser()`.
- `types/auth.ts` perdió `emailVerified` y `createdAt`: nadie los usaba y los claims no los
  traen.
- `server/api/account.delete.ts` lee `claims.sub`.
- `useSupabaseSession()` **no** es alternativa: el módulo borra `session.user` a propósito.

## Incidente B — Tres horas de 500 en producción

### Qué se vio

A las 13:04 se pushearon a `main` los commits de la migración (esquema + auth, el fix de los
claims y el paso 3). Vercel deployó y **toda la app devolvió 500**, incluidas las páginas
públicas: _"Your project's URL and Key are required to create a Supabase client!"_.

### Qué pasó de verdad

1. Los commits de la migración se habían hecho en `main` (se descartó una rama aparte) y se
   habían dejado **sin push** a propósito: `main` deploya a producción y Vercel todavía no
   tenía las variables de Supabase.
2. El push llegó antes que las variables. Nuxt no puede crear el cliente sin
   `NUXT_PUBLIC_SUPABASE_URL` y `NUXT_PUBLIC_SUPABASE_KEY`, y el error ocurre en el
   plugin: cae hasta la landing, que ni siquiera usa la base.
3. Hasta las 16:10 no hubo Supabase en producción. Se cargaron las variables en Vercel
   (públicas como configuración, la secret key como secreto), se redeployó y se validó con un
   registro nuevo. Las cuentas de la era Go no existen: no se migraron usuarios.

## Lecciones

1. **Un tipo con firma de índice no te protege.** `[key: string]: any` hace que cualquier
   propiedad compile. Ese valor se trata como _untyped_ y se envuelve en un solo módulo que
   sepa su forma real; nadie más lo toca.
2. **Network vacío significa que el error es tuyo.** Si el botón falla y no salió ningún
   request, el `throw` ocurrió en el cliente antes de llegar al SDK. Ese diagnóstico ahorró
   horas.
3. **Leé el changelog del major que instalás.** `@nuxtjs/supabase` 2.x cambió qué devuelve
   `useSupabaseUser()`. La firma "sigue compilando" es la peor forma de enterarse.
4. **Las variables de entorno van antes que el push a la rama que deploya.** Un cutover tiene
   runbook: variables → redeploy → verificar → recién entonces push. La alternativa era una
   rama aparte con su preview, que se había descartado por comodidad; costó tres horas de 500.
5. **Probar un flujo no prueba los demás.** Auth pasó el 2 de septiembre y dio una falsa
   sensación de que "Supabase funciona". Cada store que toca la identidad es un flujo
   distinto.
