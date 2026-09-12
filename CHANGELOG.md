# Changelog

Todos los cambios notables de WeraWoof se documentan aquí. El formato sigue
[Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/) y las versiones,
[Semantic Versioning](https://semver.org/lang/es/).

## [Unreleased]

### Added

- Meta `article:published_time` con la fecha del lanzamiento en werawoof.com
  (2026-09-11): el Post Inspector de LinkedIn ya no marca "No publication date
  found". El `og:type` sigue en `website`; LinkedIn muestra "Article" para
  cualquier enlace compartido.

## [1.0.2] - 2026-09-11

### Changed

- Quiénes somos: el hero usa las mismas variantes responsivas que la landing y
  la foto de Wera en el piso se recorta a la franja que realmente se ve y se
  sirve en tres tamaños (450, 700 y 900 px): de 312 KB a entre 62 y 209 KB
  según la pantalla.
- Login y registro: la foto del panel izquierdo se recomprime (110 KB → 71 KB)
  y se sirve en tres tamaños (600, 800 y 1066 px) según el ancho del panel.

### Security

- `esbuild` 0.27.7 → 0.28.2 en el lockfile (Dependabot #2, dependencia de
  desarrollo): cierra la única alerta abierta de `npm audit`.

## [1.0.1] - 2026-09-11

### Changed

- Landing: el hero se sirve en tres tamaños (800, 1200 y 1600 px) según el
  ancho de pantalla, la imagen del bento en dos (400 y 640 px), el logo del
  header se muestra a su tamaño real y se precargan las fuentes `vietnam-500`
  y `jakarta-700` del primer render (hallazgos de PageSpeed Insights).
  Lighthouse móvil pasa de 91 a 99 (FCP 2.2 s → 0.9 s, LCP 3.0 s → 1.7 s);
  escritorio 100 en las cuatro categorías.

## [1.0.0] - 2026-09-11

Primera versión estable: perfiles de perros con varias fotos, swipe con match
automático cuando el like es mutuo, chat en tiempo real por match, comunidad
con reseñas públicas, registro por correo o Google, restablecer contraseña,
borrado de cuenta, panel de administración con estadísticas y PWA instalable.
Corre como un solo proyecto Nuxt 3 sobre Supabase (Postgres con Row Level
Security, Auth, Realtime y Storage) desplegado en Vercel bajo el dominio
https://werawoof.com.

WeraWoof nació en abril de 2026 con un backend propio en Go + Gin (PostgreSQL,
Redis y WebSockets) alojado en Railway. En septiembre de 2026 ese backend se
reemplazó por completo por Supabase; la implementación en Go sigue en la
historia de git hasta el commit `4033595`.

[Unreleased]: https://github.com/kenshivr/werawoof/compare/v1.0.2...HEAD
[1.0.2]: https://github.com/kenshivr/werawoof/compare/v1.0.1...v1.0.2
[1.0.1]: https://github.com/kenshivr/werawoof/compare/v1.0.0...v1.0.1
[1.0.0]: https://github.com/kenshivr/werawoof/releases/tag/v1.0.0
