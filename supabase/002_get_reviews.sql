-- =============================================================
-- WeraWoof — Reviews públicas con nombre y avatar del autor
-- Correr UNA VEZ en el SQL Editor del proyecto `werawoof`,
-- después de schema.sql.
--
-- profiles solo es legible por usuarios logueados, pero /comunidad
-- es pública. Esta función (security definer, mismo patrón que
-- is_admin) expone SOLO name y avatar_url del autor de cada review.
-- =============================================================
create or replace function public.get_reviews()
returns table (
  id          bigint,
  user_id     uuid,
  rating      int,
  comment     text,
  created_at  timestamptz,
  user_name   text,
  user_avatar text
)
language sql
security definer set search_path = ''
stable
as $$
  select r.id, r.user_id, r.rating, r.comment, r.created_at,
         p.name, p.avatar_url
  from public.reviews r
  join public.profiles p on p.id = r.user_id
  order by r.created_at desc
$$;

grant execute on function public.get_reviews() to anon, authenticated;
