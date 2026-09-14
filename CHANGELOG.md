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

### Fixed

- Los íconos de Material Symbols ignoraban las utilidades de Tailwind (`hidden`,
  `text-3xl`, etc.) porque su clase base vivía en `fonts.css`, que se inyecta
  después del CSS de Tailwind y ganaba el empate de especificidad: en móvil los
  íconos del login se encimaban con los placeholders y todos los íconos de la
  app medían 24 px desde 1.0.0. La clase pasa a `@layer components` en
  `assets/css/tailwind.css`, capa que Tailwind siempre deja debajo de las
  utilidades.
- Franja clara entre el header y el hero de la landing en móvil: el header mide
  72 px y la página le dejaba 80 px de padding. El hero ahora pasa por debajo
  del header fijo, como en Quiénes Somos, y el padding vive dentro de la
  sección.
- Las páginas de Comunidad y Política de Privacidad no mostraban el menú
  inferior de móvil que sí tienen la landing, Quiénes Somos, Contacto y
  Términos.
- Tarjetas de Mis Canes en móvil: la foto se veía aplastada y los botones se
  salían de la tarjeta, lo que ensanchaba la página y desalineaba el header y
  el menú fijos. La foto es siempre un cuadrado del alto de la tarjeta, por
  debajo de `md` los botones van en columna pegados a la derecha y el nombre
  largo se corta con puntos suspensivos.
- El header mide 80 px fijos en todos los tamaños. Las páginas ya le dejaban
  ese espacio (`pt-20`), pero en móvil medía 72 px y en tablet 64, y esa
  diferencia se veía como una franja clara arriba del contenido (chat, app).
- Chat en móvil: sin menú inferior y sin scroll de página. El chat ocupa toda
  la pantalla bajo el header (alto en `dvh`, que descuenta la barra del
  navegador) y solo la lista de mensajes hace scroll, así el cuadro para
  escribir siempre queda visible.

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
