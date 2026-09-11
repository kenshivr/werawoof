# ADR 0005 — `frontend/` se queda como subcarpeta

- **Fecha**: 2026-09-09
- **Estado**: Aceptada

## Contexto

Con el backend Go retirado, la raíz del repo quedó con `frontend/` (la app Nuxt) y
`supabase/` (el esquema). Un repo de un solo proyecto con la app dentro de una subcarpeta
parece un resto del monorepo; aplanarlo a la raíz "se vería más limpio".

## Decisión

**No aplanar.** `frontend/` sigue siendo el proyecto Nuxt; `supabase/` y `docs/` viven al
lado. La raíz solo tiene lo transversal: licencia, changelog, hooks de git y el workflow de CI.

Motivos: el cambio es cosmético y rompería tres cosas que hoy funcionan: el Root Directory
del proyecto en Vercel, los hooks de husky (se instalan desde la raíz y corren lint-staged
sobre `frontend/`) y las rutas del workflow de CI. Además ensuciaría el `git blame` de todos
los archivos en un solo commit.

## Consecuencias

- ✅ Cero riesgo de romper el deploy o la CI por un cambio estético.
- ✅ El esquema SQL y la app quedan separados a simple vista.
- ⚠️ Todos los comandos de la app se corren desde `frontend/` (`cd frontend && npm run dev`).
- ⚠️ Hay dos `package.json`: el de la raíz (husky + lint-staged) y el de la app.
