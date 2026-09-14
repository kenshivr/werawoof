-- =============================================================
-- WeraWoof — 005: ubicación del dueño y candidatos por cercanía
-- Hasta acá get_candidates devolvía todos los perros ajenos sin
-- swipear y la "ubicación" del perfil era texto libre. Ahora cada
-- dueño guarda un punto (lat/lng) y un radio de búsqueda, y el RPC
-- devuelve solo perros dentro de ese radio, con la distancia en km.
-- Las coordenadas viven en una tabla aparte porque profiles se lee
-- entero por cualquier usuario logueado: nadie puede leer el punto
-- exacto de otro, solo la distancia que calcula el RPC.
-- Correr UNA VEZ en el SQL Editor y regenerar frontend/types/database.types.ts.
-- =============================================================

-- ---------- PostGIS ----------
create extension if not exists postgis with schema extensions;

-- ---------- Radio de búsqueda del dueño ----------
alter table public.profiles
  add column search_radius_km int not null default 10
  check (search_radius_km between 1 and 100);

-- profiles tiene el update revocado y re-otorgado por columnas (schema.sql):
grant update (search_radius_km) on table public.profiles to authenticated;

-- ---------- Ubicación del dueño ----------
create table public.profile_locations (
  user_id    uuid primary key references public.profiles (id) on delete cascade,
  lat        double precision not null check (lat between -90 and 90),
  lng        double precision not null check (lng between -180 and 180),
  -- Punto geográfico derivado de lat/lng: el front escribe números,
  -- Postgres arma el punto y el índice GiST lo usa en ST_DWithin.
  location   extensions.geography(point, 4326) not null
             generated always as (
               extensions.st_setsrid(extensions.st_makepoint(lng, lat), 4326)::extensions.geography
             ) stored,
  updated_at timestamptz not null default now()
);

create index profile_locations_location_idx
  on public.profile_locations using gist (location);

alter table public.profile_locations enable row level security;

create trigger set_profile_locations_updated_at
  before update on public.profile_locations
  for each row execute function extensions.moddatetime(updated_at);

-- Solo el dueño ve y escribe su punto. Los demás nunca lo leen:
-- get_candidates (security definer) devuelve solo la distancia.
create policy "profile_locations: cada uno lee la suya"
  on public.profile_locations for select to authenticated
  using (user_id = (select auth.uid()));

create policy "profile_locations: cada uno crea la suya"
  on public.profile_locations for insert to authenticated
  with check (user_id = (select auth.uid()));

create policy "profile_locations: cada uno edita la suya"
  on public.profile_locations for update to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

create policy "profile_locations: cada uno borra la suya"
  on public.profile_locations for delete to authenticated
  using (user_id = (select auth.uid()));

-- ---------- Candidatos por cercanía ----------
-- Cambia el tipo de retorno (setof dogs → tabla con distance_km):
-- Postgres exige borrar y volver a crear la función.
drop function public.get_candidates(bigint);

-- Columnas muertas de dogs: venían del backend Go y nadie las escribió
-- nunca (siempre 0). La ubicación es del dueño, no del perro.
alter table public.dogs drop column latitude, drop column longitude;

-- security definer para leer profile_locations de los demás (RLS solo
-- deja leer la propia); expone únicamente la distancia redondeada.
create function public.get_candidates(swiper_dog_id bigint)
returns table (
  id               bigint,
  user_id          uuid,
  name             text,
  breed            text,
  age              int,
  sex              text,
  size             text,
  bio              text,
  personality_tags text[],
  photos           text[],
  created_at       timestamptz,
  updated_at       timestamptz,
  distance_km      double precision
)
language sql
security definer set search_path = ''
stable
as $$
  with me as (
    select
      (select l.location from public.profile_locations l
        where l.user_id = (select auth.uid())) as location,
      (select p.search_radius_km from public.profiles p
        where p.id = (select auth.uid())) as radius_km
  )
  select
    d.id, d.user_id, d.name, d.breed, d.age, d.sex, d.size, d.bio,
    d.personality_tags, d.photos, d.created_at, d.updated_at,
    round((extensions.st_distance(me.location, l.location) / 1000)::numeric, 1)::double precision
      as distance_km
  from public.dogs d
  cross join me
  left join public.profile_locations l on l.user_id = d.user_id
  where public.owns_dog(swiper_dog_id)
    and d.user_id <> (select auth.uid())
    and d.id not in (
      select s.swiped_id from public.swipes s
      where s.swiper_id = swiper_dog_id
    )
    and (
      me.location is null   -- sin ubicación propia: se ve a todos
      or l.location is null -- el otro no compartió la suya: aparece al final
      or extensions.st_dwithin(me.location, l.location, me.radius_km * 1000)
    )
  order by distance_km nulls last, d.created_at desc
$$;
