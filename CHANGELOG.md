# Changelog

Todos los cambios notables de WeraWoof se documentan aquí. El formato sigue
[Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/) y las versiones,
[Semantic Versioning](https://semver.org/lang/es/).

## [Unreleased]

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

[Unreleased]: https://github.com/kenshivr/werawoof/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/kenshivr/werawoof/releases/tag/v1.0.0
