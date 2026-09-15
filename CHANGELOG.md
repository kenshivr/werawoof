# Changelog

Todos los cambios notables de WeraWoof se documentan aquí. El formato sigue
[Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/) y las versiones,
[Semantic Versioning](https://semver.org/lang/es/).

## [Unreleased]

## [1.1.0] - 2026-09-15

### Added

- Canes cerca tuyo. El dueño comparte su ubicación desde el perfil con un botón "Usar mi
  ubicación" (Geolocation API del navegador, sin proveedores externos) y elige un radio de
  búsqueda de 1 a 100 km con una barra. Al ubicarse ve su dirección aproximada ("colonia,
  municipio, estado", reverse geocoding con Nominatim/OpenStreetMap vía la server route
  `/api/geocode`) y el margen de error en metros, para confirmar que el punto es el suyo;
  la dirección se guarda junto al punto (`006_ubicacion_etiqueta.sql`) y, si el campo
  Ciudad está vacío, se llena solo. La ruta encola las consultas a Nominatim a una por
  segundo y el cliente reintenta; si la dirección no llega, la ubicación queda igual y el
  perfil la vuelve a pedir en la próxima visita. `get_candidates` filtra por ese radio con PostGIS y
  devuelve la distancia, que ahora sí aparece en la tarjeta del swipe. Las coordenadas
  viven en `profile_locations`, que solo lee su dueño: los demás reciben la distancia,
  nunca el punto. Migración `supabase/005_ubicacion.sql`; las columnas `latitude` y
  `longitude` de `dogs`, que nunca se escribieron, se retiran. ADR 0008. El subconjunto
  self-hosted de Material Symbols se regeneró con el ícono `my_location`; la receta y la
  lista de íconos quedan documentadas en `assets/css/fonts.css`.
- Meta `article:published_time` con la fecha del lanzamiento en werawoof.com
  (2026-09-11): el Post Inspector de LinkedIn ya no marca "No publication date
  found". El `og:type` sigue en `website`; LinkedIn muestra "Article" para
  cualquier enlace compartido.

### Changed

- Explorar en móvil, al estilo Tinder: la foto del can ocupa toda la pantalla
  entre el header y el menú inferior, los botones de descartar y me gusta
  flotan sobre la foto y la píldora "Explorando como" flota arriba con margen,
  en lugar de quedar pegada al header. La página ya no hace scroll; antes la
  tarjeta de alto fijo más los botones no cabían en el teléfono y había que
  desplazarse para ver los botones. En escritorio se ve igual que antes.
- En la ficha del can en móvil, los puntos que indican las fotos ahora cambian
  la foto al tocarlos, como ya pasaba en escritorio, con un área de toque de
  20 px alrededor de cada punto.
- Raza del can: la lista desplegable ahora existe también en móvil (antes era un campo de
  texto libre) y "Mestizo" es la primera opción. La lista vive en un solo lugar
  (`utils/breeds.ts`) para el perfil, el alta y la edición; al editar un can con una raza
  escrita a mano se conserva como opción.
- Perfil en móvil: los botones de guardar, eliminar cuenta, completar y volver
  dejan de estar fijos sobre el formulario y pasan al final de la página, en
  el flujo normal con scroll. La barra fija tapaba los campos y la nota de
  "podés cambiar estos datos" quedaba encimada con el menú inferior.

### Fixed

- En la app instalada desde Chrome en Android, el login, la landing, Comunidad y la
  Política de Privacidad se abrían con la barra del navegador arriba (equis, título,
  dominio y menú) en vez de a pantalla completa. El manifest no declaraba `scope` y el
  navegador lo deduce del directorio del `start_url` (`/app/dogs` → `/app/`), así que toda
  ruta fuera de `/app/` contaba como otro sitio y se abría en una Custom Tab. Ahora `scope`
  es `/`: todo werawoof.com es la app. Chrome actualiza solo el manifest de la app ya
  instalada al abrirla; para verlo de inmediato, desinstalarla y volver a instalarla.
- La foto de perfil de las cuentas de Google no cargaba (Google responde 403 a las
  imágenes de `googleusercontent.com` cuando llega un Referer de otro sitio): todas las
  etiquetas `<img>` de avatares llevan `referrerpolicy="no-referrer"`.
- Al entrar por primera vez, con Google o con el link de confirmación del correo, la app
  mandaba a Mis Canes con el perfil vacío. Ahora quien todavía no tiene canes cae en el
  perfil, que es el onboarding (tus datos y después tu can); quien ya los tiene sigue
  yendo a Mis Canes. Misma regla para el inicio de sesión con contraseña.
- La ficha del can (botón de info) y la celebración del match se dibujaban
  debajo del header y del menú inferior: el botón de volver quedaba escondido y
  los botones de abajo, tapados. El `<main>` del layout de la app es un
  stacking context (`relative z-10`) por debajo de ambos (`z-50`), así que
  ningún `z-index` interno podía taparlos. Los dos overlays salen del `<main>`
  con `<Teleport to="#teleports">`; la celebración además hace scroll cuando
  el contenido no entra en la pantalla.
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

[Unreleased]: https://github.com/kenshivr/werawoof/compare/v1.1.0...HEAD
[1.1.0]: https://github.com/kenshivr/werawoof/compare/v1.0.2...v1.1.0
[1.0.2]: https://github.com/kenshivr/werawoof/compare/v1.0.1...v1.0.2
[1.0.1]: https://github.com/kenshivr/werawoof/compare/v1.0.0...v1.0.1
[1.0.0]: https://github.com/kenshivr/werawoof/releases/tag/v1.0.0
