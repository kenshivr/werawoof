-- =============================================================
-- WeraWoof — 006: etiqueta legible de la ubicación del dueño
-- "Roma Norte, Cuauhtémoc, Ciudad de México": la obtiene el front por
-- reverse geocoding (server route /api/geocode → Nominatim/OpenStreetMap)
-- al ubicarse, y se guarda junto al punto para mostrarla sin volver a
-- consultar cada vez que abre el perfil. Solo la lee su dueño (RLS de 005).
-- Correr UNA VEZ en el SQL Editor, después de 005, y regenerar
-- frontend/types/database.types.ts.
-- =============================================================
alter table public.profile_locations
  add column label text not null default '';
