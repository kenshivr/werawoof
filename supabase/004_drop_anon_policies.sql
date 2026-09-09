-- =============================================================
-- WeraWoof — 004: retirar las policies de insert anónimo
-- Correr UNA VEZ en el SQL Editor del proyecto `werawoof`,
-- después de 003.
--
-- subscribers y page_visits se insertan SOLO desde las server
-- routes (/api/newsletter y /api/track) con la secret key, que
-- ignora RLS. Las policies de insert para anon/authenticated
-- dejaban que cualquiera escribiera en esas tablas directo con
-- la anon key (spam de suscriptores o visitas falsas).
-- Sin policy de insert, RLS niega el insert a anon y authenticated.
-- Las policies de select ("solo admin lee") quedan como están.
-- =============================================================
drop policy if exists "subscribers: cualquiera se suscribe" on public.subscribers;
drop policy if exists "page_visits: cualquiera registra visita" on public.page_visits;
