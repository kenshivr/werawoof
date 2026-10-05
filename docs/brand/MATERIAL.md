# Material de redes y firma — WeraWoof

Piezas listas para publicar, generadas con el mismo kit de marca que la app (paleta, Plus Jakarta Sans /
Be Vietnam Pro, huella y fotos de Wera). Los PNG viven en `material/`; la fuente es `material.html`
(una pieza por `?f=`) y se regeneran con `bash render-material.sh` (o `bash render-material.sh <pieza>`).

## Piezas

| Archivo | Tamaño | Para | Idea |
| --- | --- | --- | --- |
| `post-wera.png` | 1080×1350 | Instagram feed (4:5) | Wera como imagen principal + «Tu perro también merece amigos» |
| `carrusel-1..4.png` | 1080×1350 | Instagram carrusel | Portada «¿Cómo funciona WeraWoof?» + 3 pasos (perfil, match, juntarse) |
| `historia-guia.png` | 1080×1920 | Historia / portada de Reel y TikTok | Promo de la guía «Parques pet friendly en CDMX» |
| `tiktok-cierre.png` | 1080×1920 | Último cuadro de TikTok / Reel | «Síguenos para más woof» + @wera_woof |
| `post-tip.png` | 1080×1080 | Instagram feed cuadrado | Contenido de valor: 3 señales de que tu perro quiere jugar |
| `firma-preview.png` | 1280×380 | Vista previa | Cómo se ve la firma de correo |

Las piezas verticales dejan 250 px libres arriba y abajo para la interfaz de Instagram y TikTok.

## Copies sugeridos

**post-wera**
> Tu perro también merece amigos 🐾 En WeraWoof creas su perfil, haces match con perros cerca de ti y organizan
> un playdate. Gratis, en werawoof.com (link en bio).
> #WeraWoof #PerrosCDMX #PlaydateCanino #DogFriendly #PerrosMexico

**carrusel**
> ¿Cómo funciona WeraWoof? Tres pasos y tu perro ya tiene plan 👉 Desliza.
> 1) Crea su perfil 2) Haz match 3) ¡A juntarse! Cuéntanos en comentarios cómo se llama tu perro.
> #WeraWoof #TinderParaPerros #SocializacionCanina #PerrosCDMX

**historia-guia**
> Nueva guía: parques pet friendly en CDMX, con horarios y qué llevar. Léela en werawoof.com/guias
> (sticker de enlace a la guía).

**post-tip**
> ¿Cómo sabes que tu perro quiere jugar? Reverencia de juego, cola suelta y brincos cortos mirándote.
> Más consejos en werawoof.com/guias.
> #ComportamientoCanino #PerrosFelices #WeraWoof

**TikTok (guion corto, 15–25 s)**
> Gancho: «¿Tu perro no tiene amigos perros?» → muestra la app: perfil, swipe, match, chat →
> cierre con `tiktok-cierre.png`: «Síguenos para más woof, @wera_woof».
> Texto del video: «El Tinder para perros, gratis en werawoof.com».

## Firma de correo

1. Abre `firma-correo.html` en el navegador (sin `?preview`).
2. Selecciona todo (Ctrl+A), copia y pega en Gmail → Configuración → Firma (o en Outlook → Firmas).
3. Es una firma de marca: no lleva nombre de persona, la usa cualquiera del equipo tal cual.

El logo se carga desde `https://werawoof.com/images/logo-firma.png` (PNG porque Outlook de escritorio
no muestra WebP). Ese archivo está en `frontend/public/images/` y existe en producción a partir del
siguiente deploy; antes de eso la firma se ve sin logo.

## Agregar una pieza nueva

1. Copia un bloque de `formats` en `material.html`, cambia textos y foto (`frontend/public/images/`).
2. Agrega su tamaño en `SIZES` dentro de `render-material.sh`.
3. `bash render-material.sh <pieza>` y revisa el PNG.
