# ADR 0008 — Cercanía por coordenadas y radio, no por catálogo de colonias

- **Fecha**: 2026-09-14
- **Estado**: Aceptada

## Contexto

Hasta esta decisión `get_candidates` devolvía todos los perros ajenos sin swipear, ordenados
por fecha. La "ubicación" del perfil era un texto libre imposible de comparar, `dogs` tenía
columnas `latitude`/`longitude` que nadie escribía (herencia del backend Go) y la distancia
que la tarjeta ya sabía mostrar nunca llegaba. Para mostrar canes cercanos se evaluaron dos
caminos: un catálogo de estados, municipios y colonias de México (SEPOMEX) para emparejar por
"misma colonia", o guardar coordenadas por dueño y buscar por radio.

## Decisión

**Coordenadas por dueño, radio elegible y PostGIS.** Cada cuenta guarda un punto en
`profile_locations` (lat/lng escritos por el front; el `geography` se deriva con una columna
generada e indexada con GiST) y un `search_radius_km` en `profiles`. `get_candidates` filtra
con `ST_DWithin` y devuelve la distancia redondeada con `ST_Distance`. El punto sale de la
Geolocation API del navegador con un botón "Usar mi ubicación": sin proveedor externo, sin
API key y sin costo. El catálogo de colonias quedó descartado como mecanismo de match: el
oficial no trae coordenadas, "misma colonia" es una igualdad de texto que con pocos usuarios
devuelve vacío, no permite "a la redonda" y ata la app a un solo país.

## Consecuencias

- ✅ El feed es realmente "cerca tuyo" y la distancia en km aparece en la tarjeta.
- ✅ Funciona en cualquier país: no depende de un catálogo nacional.
- ✅ Privacidad: `profile_locations` solo la lee su dueño; el resto recibe la distancia que
  calcula el RPC (`security definer`), nunca el punto.
- ⚠️ Quien no comparte ubicación ve a todos y aparece al final para los demás. Es una
  decisión a favor de no vaciar el mazo mientras hay pocos usuarios; se puede endurecer a
  "solo con ubicación" cambiando una condición del RPC.
- ⚠️ La geolocalización exige permiso del navegador y contexto seguro (https o localhost).
  Un buscador de direcciones con autocomplete, para quien no quiera dar su GPS, queda como
  fase 2 y requiere un proveedor (Google con tarjeta; Nominatim lo prohíbe).
- ⚠️ El radio está acotado a 1–100 km en la base y el selector es una barra en ese rango.
- ⚠️ Para que el dueño confirme que el punto es su casa, se muestra la dirección aproximada
  ("colonia, municipio, estado") y el margen de error en metros. La dirección sale de
  Nominatim (OpenStreetMap) a través de la server route `/api/geocode`: es la única ruta
  sin secreto (ADR 0003), y existe porque Nominatim exige un User-Agent que identifique a
  la app, cosa que el navegador no permite. Condiciones: 1 request por segundo, resultados
  cacheados (se guarda la etiqueta junto al punto) y atribución visible a OpenStreetMap.
  Nominatim prohíbe usarlo como autocomplete; para un buscador de direcciones hará falta
  otro proveedor.
- ⚠️ El límite de 1 consulta por segundo se respeta con una cola en la server route (429 +
  `Retry-After` si se juntan más de cinco) y reintentos en el cliente; si aun así falla, el
  punto se guarda sin dirección y el perfil la vuelve a pedir en la próxima visita. La cola
  vale por instancia de Vercel: con tráfico real hará falta un limitador compartido (una
  fila en Postgres) o cambiar de proveedor.
