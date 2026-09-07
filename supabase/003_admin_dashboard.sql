-- =============================================================
-- WeraWoof — 003: dashboard de admin en una sola función
-- Reemplaza GET /admin/dashboard del backend Go (admin_repository.go):
-- todas las agregaciones viven en Postgres y el front hace un solo rpc.
-- security definer para poder leer auth.users (email, verificado, Google).
-- Correr UNA VEZ en el SQL Editor y regenerar frontend/types/database.types.ts.
-- =============================================================

create or replace function public.get_admin_dashboard()
returns jsonb
language plpgsql
security definer set search_path = ''
stable
as $$
begin
  if not public.is_admin() then
    raise exception 'solo admin' using errcode = '42501';
  end if;

  return jsonb_build_object(

    -- Usuarios con sus perros (tab Usuarios)
    'users', (
      select coalesce(jsonb_agg(to_jsonb(u) order by u.created_at desc), '[]'::jsonb)
      from (
        select
          p.id,
          p.name,
          au.email,
          p.avatar_url as avatar,
          p.bio,
          p.location,
          p.role,
          p.created_at,
          (au.email_confirmed_at is not null) as verified,
          exists (
            select 1 from auth.identities i
            where i.user_id = p.id and i.provider = 'google'
          ) as google,
          (
            select coalesce(jsonb_agg(jsonb_build_object(
              'id', d.id,
              'name', d.name,
              'breed', d.breed,
              'age', d.age,
              'sex', d.sex,
              'size', d.size,
              'bio', d.bio,
              'photos', d.photos,
              'personality_tags', d.personality_tags
            ) order by d.created_at desc), '[]'::jsonb)
            from public.dogs d
            where d.user_id = p.id
          ) as dogs
        from public.profiles p
        join auth.users au on au.id = p.id
      ) u
    ),

    -- Páginas más visitadas (tab Analytics)
    'visits', (
      select coalesce(jsonb_agg(to_jsonb(v) order by v.total_visits desc), '[]'::jsonb)
      from (
        select
          path,
          count(*) as total_visits,
          count(distinct ip) as unique_ips,
          max(visited_at) as last_visit_at
        from public.page_visits
        group by path
      ) v
    ),

    -- Tarjetas de tráfico
    'stats', jsonb_build_object(
      'total_users',     (select count(*) from public.profiles),
      'total_dogs',      (select count(*) from public.dogs),
      'total_visits',    (select count(*) from public.page_visits),
      'unique_visitors', (select count(distinct ip) from public.page_visits)
    ),

    -- Swipes, matches y mensajes (tab Engagement)
    'engagement', (
      select jsonb_build_object(
        'total_likes',           likes,
        'total_dislikes',        dislikes,
        'total_matches',         total_matches,
        -- Reciprocidad: qué % de los likes fue correspondido. Cada match nace
        -- de 2 likes mutuos, así que los likes correspondidos = matches * 2.
        'match_rate',            case when likes > 0 then least(total_matches::float * 2 / likes * 100, 100) else 0 end,
        'total_messages',        total_messages,
        'matches_with_messages', matches_with_messages,
        'ghost_matches',         total_matches - matches_with_messages,
        'avg_msgs_per_match',    case when matches_with_messages > 0
                                      then total_messages::float / matches_with_messages else 0 end
      )
      from (
        select
          (select count(*) from public.swipes where direction = 'like')    as likes,
          (select count(*) from public.swipes where direction = 'dislike') as dislikes,
          (select count(*) from public.matches)                            as total_matches,
          (select count(*) from public.messages)                           as total_messages,
          (select count(distinct match_id) from public.messages)           as matches_with_messages
      ) e
    ),

    -- Perfil de la comunidad (tab Comunidad)
    'community', (
      select jsonb_build_object(
        'verified_users',    verified_users,
        'google_users',      google_users,
        'users_with_dogs',   users_with_dogs,
        'activation_rate',   case when total_users > 0 then users_with_dogs::float / total_users * 100 else 0 end,
        'total_subscribers', total_subscribers,
        'total_reviews',     total_reviews,
        'avg_rating',        avg_rating
      )
      from (
        select
          (select count(*) from public.profiles) as total_users,
          (select count(*) from public.profiles p
             join auth.users au on au.id = p.id
             where au.email_confirmed_at is not null) as verified_users,
          (select count(distinct i.user_id) from auth.identities i
             where i.provider = 'google') as google_users,
          (select count(distinct user_id) from public.dogs) as users_with_dogs,
          (select count(*) from public.subscribers) as total_subscribers,
          (select count(*) from public.reviews) as total_reviews,
          (select coalesce(avg(rating), 0) from public.reviews) as avg_rating
      ) c
    ),

    -- Altas por semana, últimas 8
    'growth', (
      select coalesce(jsonb_agg(to_jsonb(g) order by g.week desc), '[]'::jsonb)
      from (
        select
          to_char(date_trunc('week', created_at), 'YYYY-MM-DD') as week,
          count(*) as new_users
        from public.profiles
        group by date_trunc('week', created_at)
        order by date_trunc('week', created_at) desc
        limit 8
      ) g
    ),

    -- Top 10 ubicaciones
    'locations', (
      select coalesce(jsonb_agg(to_jsonb(l) order by l.count desc), '[]'::jsonb)
      from (
        select location, count(*) as count
        from public.profiles
        where location <> ''
        group by location
        order by count desc
        limit 10
      ) l
    ),

    -- Top 10 razas
    'breeds', (
      select coalesce(jsonb_agg(to_jsonb(b) order by b.count desc), '[]'::jsonb)
      from (
        select breed, count(*) as count
        from public.dogs
        where breed <> ''
        group by breed
        order by count desc
        limit 10
      ) b
    ),

    -- Mobile vs desktop por user-agent
    'devices', (
      select jsonb_build_object(
        'mobile_visits',  mobile,
        'desktop_visits', total - mobile,
        'mobile_rate',    case when total > 0 then mobile::float / total * 100 else 0 end
      )
      from (
        select
          count(*) as total,
          count(*) filter (where user_agent ~* '(mobile|android|iphone|ipad)') as mobile
        from public.page_visits
      ) dv
    )
  );
end;
$$;

-- Solo usuarios logueados pueden llamarla (y adentro exige rol admin)
revoke execute on function public.get_admin_dashboard() from public, anon;
grant execute on function public.get_admin_dashboard() to authenticated;
