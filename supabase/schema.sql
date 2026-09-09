-- =============================================================
-- WeraWoof — Schema inicial para Supabase
-- Reemplaza el backend Go (Gin + GORM + Redis en Railway).
-- Correr UNA VEZ en el SQL Editor del proyecto `werawoof`.
-- =============================================================

-- ---------- Extensiones ----------
create extension if not exists moddatetime schema extensions;

-- =============================================================
-- 1. PROFILES — espejo de auth.users (mismo patrón que DiNelo)
--    name/location/bio/avatar del User de Go viven acá;
--    email, password, Google OAuth y verificación los maneja Supabase Auth.
-- =============================================================
create table public.profiles (
  id         uuid primary key references auth.users (id) on delete cascade,
  name       text not null default '',
  location   text not null default '',
  bio        text not null default '',
  avatar_url text not null default '',
  role       text not null default 'user' check (role in ('user', 'admin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create trigger set_profiles_updated_at
  before update on public.profiles
  for each row execute function extensions.moddatetime(updated_at);

-- Crea el profile automáticamente al registrarse (email o Google)
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, name, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'name', new.raw_user_meta_data ->> 'full_name', ''),
    coalesce(new.raw_user_meta_data ->> 'avatar_url', '')
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- role NO es editable por el usuario (evita auto-promoverse a admin):
-- se revoca update total y se re-otorga solo sobre columnas de perfil.
revoke update on table public.profiles from anon, authenticated;
grant update (name, location, bio, avatar_url) on table public.profiles to authenticated;

-- Helper: ¿el usuario actual es admin?
create or replace function public.is_admin()
returns boolean
language sql
security definer set search_path = ''
stable
as $$
  select exists (
    select 1 from public.profiles p
    where p.id = (select auth.uid()) and p.role = 'admin'
  );
$$;

create policy "profiles: usuarios logueados leen todos"
  on public.profiles for select to authenticated using (true);

create policy "profiles: cada uno edita el suyo"
  on public.profiles for update to authenticated
  using (id = (select auth.uid()))
  with check (id = (select auth.uid()));

-- Sin insert (lo hace el trigger) ni delete (cascade desde auth.users).

-- =============================================================
-- 2. DOGS
-- =============================================================
create table public.dogs (
  id               bigint generated always as identity primary key,
  user_id          uuid not null references public.profiles (id) on delete cascade,
  name             text not null,
  breed            text not null default '',
  age              int  not null default 0,
  sex              text not null default '',
  size             text not null default '',
  bio              text not null default '',
  personality_tags text[] not null default '{}',
  photos           text[] not null default '{}',
  latitude         double precision not null default 0,
  longitude        double precision not null default 0,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

create index dogs_user_id_idx on public.dogs (user_id);

alter table public.dogs enable row level security;

create trigger set_dogs_updated_at
  before update on public.dogs
  for each row execute function extensions.moddatetime(updated_at);

-- Helper: ¿el perro pertenece al usuario actual?
create or replace function public.owns_dog(dog_id bigint)
returns boolean
language sql
security definer set search_path = ''
stable
as $$
  select exists (
    select 1 from public.dogs d
    where d.id = dog_id and d.user_id = (select auth.uid())
  );
$$;

create policy "dogs: usuarios logueados ven todos (candidatos/matches)"
  on public.dogs for select to authenticated using (true);

create policy "dogs: crear solo propios"
  on public.dogs for insert to authenticated
  with check (user_id = (select auth.uid()));

create policy "dogs: editar solo propios"
  on public.dogs for update to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

create policy "dogs: borrar solo propios"
  on public.dogs for delete to authenticated
  using (user_id = (select auth.uid()));

-- =============================================================
-- 3. SWIPES — un swipe por par de perros; el match nace por trigger
-- =============================================================
create table public.swipes (
  id         bigint generated always as identity primary key,
  swiper_id  bigint not null references public.dogs (id) on delete cascade,
  swiped_id  bigint not null references public.dogs (id) on delete cascade,
  direction  text not null check (direction in ('like', 'dislike')),
  created_at timestamptz not null default now(),
  unique (swiper_id, swiped_id),
  check (swiper_id <> swiped_id)
);

create index swipes_swiped_id_idx on public.swipes (swiped_id);

alter table public.swipes enable row level security;

create policy "swipes: swipear con mi perro a un perro ajeno"
  on public.swipes for insert to authenticated
  with check (public.owns_dog(swiper_id) and not public.owns_dog(swiped_id));

create policy "swipes: ver los que involucran mis perros"
  on public.swipes for select to authenticated
  using (public.owns_dog(swiper_id) or public.owns_dog(swiped_id));

-- =============================================================
-- 4. MATCHES — par ordenado (dog1 < dog2) para unicidad simple.
--    Reemplaza HasMutualLike + CreateMatch del swipe_service de Go.
-- =============================================================
create table public.matches (
  id         bigint generated always as identity primary key,
  dog1_id    bigint not null references public.dogs (id) on delete cascade,
  dog2_id    bigint not null references public.dogs (id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (dog1_id, dog2_id),
  check (dog1_id < dog2_id)
);

create index matches_dog2_id_idx on public.matches (dog2_id);

alter table public.matches enable row level security;

-- Like recíproco => match automático
create or replace function public.handle_swipe()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  if new.direction = 'like' and exists (
    select 1 from public.swipes s
    where s.swiper_id = new.swiped_id
      and s.swiped_id = new.swiper_id
      and s.direction = 'like'
  ) then
    insert into public.matches (dog1_id, dog2_id)
    values (least(new.swiper_id, new.swiped_id), greatest(new.swiper_id, new.swiped_id))
    on conflict do nothing;
  end if;
  return new;
end;
$$;

create trigger on_swipe_created
  after insert on public.swipes
  for each row execute function public.handle_swipe();

create policy "matches: ver los de mis perros"
  on public.matches for select to authenticated
  using (public.owns_dog(dog1_id) or public.owns_dog(dog2_id));

-- Sin insert/update/delete directo: solo el trigger crea matches.

-- =============================================================
-- 5. MESSAGES — chat por match (Realtime reemplaza el WebSocket de Go)
-- =============================================================
create table public.messages (
  id         bigint generated always as identity primary key,
  match_id   bigint not null references public.matches (id) on delete cascade,
  sender_id  uuid not null references public.profiles (id) on delete cascade,
  content    text not null check (char_length(content) between 1 and 2000),
  created_at timestamptz not null default now()
);

create index messages_match_created_idx on public.messages (match_id, created_at);

alter table public.messages enable row level security;

-- Helper: ¿participo (con alguno de mis perros) en este match?
create or replace function public.is_match_member(m_id bigint)
returns boolean
language sql
security definer set search_path = ''
stable
as $$
  select exists (
    select 1 from public.matches m
    where m.id = m_id
      and (public.owns_dog(m.dog1_id) or public.owns_dog(m.dog2_id))
  );
$$;

create policy "messages: leer los de mis matches"
  on public.messages for select to authenticated
  using (public.is_match_member(match_id));

create policy "messages: enviar como yo en mis matches"
  on public.messages for insert to authenticated
  with check (sender_id = (select auth.uid()) and public.is_match_member(match_id));

-- =============================================================
-- 6. REVIEWS — una por usuario (upsert), lectura pública en la landing
-- =============================================================
create table public.reviews (
  id         bigint generated always as identity primary key,
  user_id    uuid not null unique references public.profiles (id) on delete cascade,
  rating     int not null check (rating between 1 and 5),
  comment    text not null check (char_length(comment) between 1 and 1000),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.reviews enable row level security;

create trigger set_reviews_updated_at
  before update on public.reviews
  for each row execute function extensions.moddatetime(updated_at);

create policy "reviews: lectura pública"
  on public.reviews for select to anon, authenticated using (true);

create policy "reviews: crear la propia"
  on public.reviews for insert to authenticated
  with check (user_id = (select auth.uid()));

create policy "reviews: editar la propia"
  on public.reviews for update to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

-- =============================================================
-- 7. SUBSCRIBERS — newsletter (el mail de bienvenida va por server route)
-- =============================================================
create table public.subscribers (
  id         bigint generated always as identity primary key,
  email      text not null unique check (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  created_at timestamptz not null default now()
);

alter table public.subscribers enable row level security;

create policy "subscribers: cualquiera se suscribe"
  on public.subscribers for insert to anon, authenticated
  with check (true);

create policy "subscribers: solo admin lee"
  on public.subscribers for select to authenticated
  using (public.is_admin());

-- =============================================================
-- 8. PAGE_VISITS — tracking del dashboard admin (POST /track de Go)
-- =============================================================
create table public.page_visits (
  id         bigint generated always as identity primary key,
  path       text not null,
  ip         text not null default '',
  user_agent text not null default '',
  visited_at timestamptz not null default now()
);

create index page_visits_path_idx on public.page_visits (path);
create index page_visits_visited_at_idx on public.page_visits (visited_at);

alter table public.page_visits enable row level security;

create policy "page_visits: cualquiera registra visita"
  on public.page_visits for insert to anon, authenticated
  with check (true);

create policy "page_visits: solo admin lee"
  on public.page_visits for select to authenticated
  using (public.is_admin());

-- =============================================================
-- 9. RPC — candidatos para swipear (FindCandidates de Go):
--    perros ajenos que mi perro todavía no swipeó.
-- =============================================================
create or replace function public.get_candidates(swiper_dog_id bigint)
returns setof public.dogs
language sql
stable
as $$
  select d.*
  from public.dogs d
  where public.owns_dog(swiper_dog_id)
    and d.user_id <> (select auth.uid())
    and d.id not in (
      select s.swiped_id from public.swipes s
      where s.swiper_id = swiper_dog_id
    )
  order by d.created_at desc
$$;

-- =============================================================
-- 10. REALTIME — chat y notificación de match en vivo
--     (postgres_changes respeta las policies de select de arriba)
-- =============================================================
alter publication supabase_realtime add table public.messages;
alter publication supabase_realtime add table public.matches;

-- =============================================================
-- 11. STORAGE — fotos de perros y avatares (reemplaza Cloudinary).
--     Convención de path: {user_id}/lo-que-sea.jpg
-- =============================================================
insert into storage.buckets (id, name, public)
values ('photos', 'photos', true);

create policy "storage: lectura pública de photos"
  on storage.objects for select to anon, authenticated
  using (bucket_id = 'photos');

create policy "storage: subir solo a mi carpeta"
  on storage.objects for insert to authenticated
  with check (
    bucket_id = 'photos'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );

create policy "storage: borrar solo lo mío"
  on storage.objects for delete to authenticated
  using (
    bucket_id = 'photos'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );

-- =============================================================
-- POST-SETUP (manual, fuera de este script):
--   1. Promover tu admin cuando exista tu usuario:
--      update public.profiles set role = 'admin' where id = '<tu-uuid>';
--   2. Habilitar Google como provider en Authentication > Providers.
--   3. Configurar Site URL y Redirect URLs en Authentication > URL Configuration
--      (https://werawoof.vercel.app/** y http://localhost:3003/**).
-- =============================================================
