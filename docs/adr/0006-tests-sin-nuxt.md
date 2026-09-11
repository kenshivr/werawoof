# ADR 0006 — Tests de las server routes sin levantar Nuxt

- **Fecha**: 2026-09-10
- **Estado**: Aceptada

## Contexto

Hasta el 2026-09-10 el repo no tenía un solo test propio: la CI pasaba con
`vitest --passWithNoTests`. Lo que más vale la pena probar es el "backend" de cuatro rutas
(ADR 0003) y la lógica del chat (deduplicación del eco de Realtime). Levantar Nuxt entero por
test con `@nuxt/test-utils` es lento y arrastra Supabase, correo y red.

## Decisión

**Vitest en entorno `node`, sin Nuxt.** Los auto-imports de Nitro (`defineEventHandler`,
`readBody`, `createError`, `getRequestIP`, `getRequestHeader`) se exponen como globales desde
`h3` en `tests/setup.ts`; `useRuntimeConfig` y los helpers de correo también. Cada ruta se
ejecuta de verdad con `createApp` + `toWebHandler` de `h3` y un `Request` estándar, así
`readBody`, los códigos de error y `x-forwarded-for` se comportan como en producción.

`#supabase/server` se resuelve a un mock por alias y `nodemailer` se mockea **en el setup
global**, no en cada spec: ningún test puede abrir una conexión SMTP real. Los specs viven en
`frontend/tests/`, fuera de `server/`, porque Nitro registraría un `.spec.ts` dentro de
`server/api` como ruta.

## Consecuencias

- ✅ 48 tests en cinco archivos corren en menos de dos segundos, sin red ni base.
- ✅ Los tests se typechequean con `nuxi typecheck` porque el `tsconfig` de la app incluye
  `tests/` y `.nuxt/types` declara los globales de Nitro.
- ⚠️ Cada auto-import nuevo que use una ruta hay que reflejarlo a mano en `setup.ts`.
- ⚠️ No se prueba el render de páginas ni los stores que dependen de Nuxt; solo lógica pura
  y rutas.
- ⚠️ Un `vi.mock` dentro de un spec no aplica si el módulo ya fue importado por el setup: el
  primer intento de mockear `nodemailer` por spec intentó loguearse en Gmail de verdad.
