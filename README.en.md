<div align="center">

# 🐾 WeraWoof

### _Conectá patitas, creá recuerdos._

A matchmaking platform for dog owners — swipe, match, and chat in real time.

[![Nuxt](https://img.shields.io/badge/Nuxt-3-00DC82?style=flat-square&logo=nuxt.js&logoColor=white)](https://nuxt.com)
[![Vue](https://img.shields.io/badge/Vue-3-4FC08D?style=flat-square&logo=vue.js&logoColor=white)](https://vuejs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Supabase](https://img.shields.io/badge/Supabase-Postgres%20%C2%B7%20Auth%20%C2%B7%20Realtime%20%C2%B7%20Storage-3FCF8E?style=flat-square&logo=supabase&logoColor=white)](https://supabase.com)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Vercel](https://img.shields.io/badge/Vercel-deployed-000000?style=flat-square&logo=vercel&logoColor=white)](https://werawoof.com)
[![CI](https://github.com/kenshivr/werawoof/actions/workflows/ci.yml/badge.svg)](https://github.com/kenshivr/werawoof/actions/workflows/ci.yml)
[![Lighthouse](https://img.shields.io/badge/Lighthouse%20mobile-99%20·%20100%20·%20100%20·%20100-4ade80?style=flat-square&logo=lighthouse&logoColor=white)](https://pagespeed.web.dev/analysis?url=https%3A%2F%2Fwerawoof.com)
[![PWA](https://img.shields.io/badge/PWA-installable-4ade80?style=flat-square&logo=pwa&logoColor=white)](https://werawoof.com)
![App language](https://img.shields.io/badge/app%20language-Spanish-93c5fd?style=flat-square)

[Live Demo](https://werawoof.com) · [Report Bug](https://github.com/kenshivr/werawoof/issues) · [Request Feature](https://github.com/kenshivr/werawoof/issues)

🌐 [Léelo en español](README.md)

</div>

---

## Table of Contents

- [Overview](#overview)
- [Screenshots](#screenshots)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Supabase Setup](#supabase-setup)
  - [Environment Variables](#environment-variables)
  - [Running in Development](#running-in-development)
- [Scripts](#scripts)
- [Project Structure](#project-structure)
- [Data Model](#data-model)
- [Server Routes](#server-routes)
- [Security Model](#security-model)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

**WeraWoof** is a web application inspired by Tinder — but for dogs. Dog owners create profiles for their pets, swipe on other dogs, get matched when both sides like each other, and chat in real time with the other owner to arrange playdates.

The name comes from _Wera_, a real dog that inspired the project.

WeraWoof was originally built with a Go + Gin backend (PostgreSQL, Redis, WebSockets) hosted on Railway. In September 2026 the whole backend was replaced by **Supabase** — Postgres with Row Level Security, Auth, Realtime and Storage — and the app now ships as a single Nuxt 3 project on Vercel. The Go implementation remains in the git history up to commit `4033595`.

---

## Screenshots

<p align="center">
  <img src="docs/screenshots/mobile-landing.webp" width="32%" alt="Landing on mobile: find the perfect match for your dog" />
  <img src="docs/screenshots/mobile-swipe.webp" width="32%" alt="Swipe on mobile: exploring as Wera, a card for Canela" />
  <img src="docs/screenshots/mobile-match.webp" width="32%" alt="It's a match on mobile: Lolo Bartolo and Wera" />
</p>

<p align="center">
  <img src="docs/screenshots/desktop-swipe.webp" width="49%" alt="Swipe on desktop: a dog card with pass and like buttons" />
  <img src="docs/screenshots/desktop-chat.webp" width="49%" alt="Real-time chat on desktop between two owners" />
</p>

[PageSpeed Insights](https://pagespeed.web.dev/analysis?url=https%3A%2F%2Fwerawoof.com) on the production landing, 2026-09-11:

| Device  | Performance | Accessibility | Best Practices | SEO | FCP   | LCP   |
| ------- | ----------- | ------------- | -------------- | --- | ----- | ----- |
| Mobile  | 99          | 100           | 100            | 100 | 0.9 s | 1.7 s |
| Desktop | 100         | 100           | 100            | 100 | 0.4 s | 0.7 s |

---

## Features

### 🐕 Dog Profiles

- Multiple dogs per account
- Breed, age, sex, size, bio, personality tags and location
- Multiple photos per dog stored in Supabase Storage, with drag-and-drop ordering

### 💘 Swipe & Match

- Like or dislike other dogs
- Candidate feed excludes your own dogs and dogs you already swiped (Postgres RPC)
- A mutual like creates the match automatically through a database trigger
- Match celebration UI and a matches list per account

### 💬 Real-Time Chat

- One conversation per match
- Message history loaded from Postgres, new messages pushed through Supabase Realtime
- Emoji picker

### 🌎 Community

- Public `/comunidad` page with reviews from members (one review per user, editable)
- Public landing, about page, contact form, newsletter and legal pages

### 🔐 Authentication

- Email + password registration with confirmation email
- Google OAuth
- Password reset by email
- Account deletion (cascades to profile, dogs, swipes, matches and messages)
- Profile row created automatically on sign-up by a database trigger

### 📊 Admin Dashboard

- Restricted to users with the `admin` role
- Users, dogs, matches, subscribers and page-visit stats aggregated by a single Postgres function
- Page-visit tracking from a server route (path, IP and user agent)

---

## Tech Stack

| Layer          | Technology                                                                         |
| -------------- | ---------------------------------------------------------------------------------- |
| **Framework**  | Nuxt 3 (Vue 3, SSR) on Nitro                                                       |
| **Language**   | TypeScript (strict)                                                                |
| **State**      | Pinia                                                                              |
| **Styling**    | Tailwind CSS, self-hosted fonts                                                    |
| **Backend**    | Supabase — Postgres, Auth, Realtime, Storage                                       |
| **Client SDK** | `@nuxtjs/supabase` (supabase-js, SSR cookies)                                      |
| **Server**     | Nitro server routes for contact, newsletter, tracking, account removal             |
| **Email**      | Gmail SMTP through nodemailer (dedicated account)                                  |
| **Analytics**  | Vercel Analytics                                                                   |
| **Quality**    | ESLint, Prettier, Vitest, husky + lint-staged · Lighthouse 99 mobile / 100 desktop |
| **CI/CD**      | GitHub Actions (lint + typecheck + tests), Vercel (deploy)                         |
| **Hosting**    | Vercel                                                                             |

---

## Architecture

```
┌───────────────────────────────────────────────────────────────┐
│                     NUXT 3 APP (Vercel)                       │
│                                                               │
│   Pages · Components · Pinia stores · Route middlewares       │
│                                                               │
│   ┌──────────────────────────┐   ┌──────────────────────────┐ │
│   │  supabase-js (browser)   │   │  Nitro server routes     │ │
│   │  Auth · tables via RLS   │   │  /api/contact            │ │
│   │  RPC · Realtime          │   │  /api/newsletter         │ │
│   │  Storage                 │   │  /api/track              │ │
│   │                          │   │  /api/account (DELETE)   │ │
│   └────────────┬─────────────┘   └───────┬──────────┬───────┘ │
└────────────────┼─────────────────────────┼──────────┼─────────┘
                 │ anon key + user JWT     │ secret   │ SMTP
                 ▼                         ▼ key      ▼
┌──────────────────────────────────────────────┐  ┌────────────┐
│                  SUPABASE                    │  │   GMAIL    │
│  Postgres (RLS, triggers, RPC) · Auth        │  │  (SMTP)    │
│  Realtime (messages, matches) · Storage      │  │            │
└──────────────────────────────────────────────┘  └────────────┘
```

- **No custom backend.** The browser talks to Supabase directly with the user's JWT; every table is protected by Row Level Security, so the policies _are_ the authorization layer.
- **Business rules live in Postgres.** Profile creation, match detection and candidate selection are triggers and functions, not application code.
- **Server routes only where a secret is needed.** The service-role key and the SMTP credentials never reach the browser.

The reasoning behind these choices is recorded in the [architecture decision records](docs/adr/README.md) (Spanish). There is also a [postmortem of the cutover day](docs/postmortem-2026-09-06-cutover.md).

---

## Getting Started

### Prerequisites

- [Node.js 22](https://nodejs.org/) and npm (the version CI runs)
- A [Supabase](https://supabase.com) project (the free tier is enough)
- Optional: a Gmail account with an [App Password](https://myaccount.google.com/apppasswords) for the contact form and the newsletter

### Installation

```bash
git clone https://github.com/kenshivr/werawoof.git
cd werawoof/frontend
npm install
```

`npm install` also installs the git hooks from the repository root (husky).

### Supabase Setup

1. Create a project in the Supabase dashboard.
2. Open the **SQL Editor** and run, in this order and only once each:
   - `supabase/schema.sql` — tables, RLS policies, triggers, RPC, Realtime and the `photos` bucket
   - `supabase/002_get_reviews.sql` — public reviews function for `/comunidad`
   - `supabase/003_admin_dashboard.sql` — admin dashboard function
   - `supabase/004_drop_anon_policies.sql` — removes the anonymous insert policies (server routes write with the secret key)
3. **Authentication → URL Configuration**: set the Site URL to your production URL and add `http://localhost:3003/**` plus `https://<your-domain>/**` to the Redirect URLs.
4. **Authentication → Providers → Google** (optional): create an OAuth client in Google Cloud Console with `https://<project-ref>.supabase.co/auth/v1/callback` as the redirect URI and paste the client ID and secret.
5. **Authentication → SMTP Settings** (recommended): configure a custom SMTP. Supabase's built-in sender only delivers a few emails per hour to project members, which blocks real sign-ups.
6. Promote your admin once your user exists:

   ```sql
   update public.profiles set role = 'admin' where id = '<your-user-uuid>';
   ```

7. Generate the TypeScript types for the schema and save them as `frontend/types/database.types.ts` (Supabase dashboard → API Docs → _Generate and download types_, or `supabase gen types typescript --project-id <project-ref> --schema public`). Regenerate them whenever the schema changes.

### Environment Variables

Create `frontend/.env`:

| Variable                   | Scope       | Description                                                                           |
| -------------------------- | ----------- | ------------------------------------------------------------------------------------- |
| `NUXT_PUBLIC_SUPABASE_URL` | public      | Project URL, `https://<project-ref>.supabase.co`                                      |
| `NUXT_PUBLIC_SUPABASE_KEY` | public      | Anon / publishable key                                                                |
| `NUXT_SUPABASE_SECRET_KEY` | server only | Service-role / secret key. Used by `/api/account`, `/api/newsletter` and `/api/track` |
| `NUXT_SMTP_USER`           | server only | Gmail address that sends contact and newsletter emails                                |
| `NUXT_SMTP_PASS`           | server only | Gmail App Password for that account                                                   |

> `@nuxtjs/supabase` also accepts `SUPABASE_URL` and `SUPABASE_KEY` locally. `SUPABASE_SERVICE_KEY` is deprecated by the module; use `NUXT_SUPABASE_SECRET_KEY`.

The inbox that receives contact messages and newsletter notices is the `CONTACT_INBOX` constant in `frontend/server/utils/mail.ts`. Change it if you self-host.

### Running in Development

```bash
cd frontend
npm run dev
```

| Service       | URL                       |
| ------------- | ------------------------- |
| App           | http://localhost:3003     |
| Dashboard     | http://localhost:3003/app |
| Nuxt DevTools | enabled in dev            |

Register with a real email address: the confirmation link goes through Supabase Auth. Google login only works once the provider is enabled in the dashboard.

---

## Scripts

All scripts run from `frontend/`:

| Script              | What it does                       |
| ------------------- | ---------------------------------- |
| `npm run dev`       | Dev server on port 3003            |
| `npm run build`     | Production build (`.output/`)      |
| `npm run preview`   | Serve the production build locally |
| `npm run generate`  | Static generation                  |
| `npm run lint`      | ESLint                             |
| `npm run lint:fix`  | ESLint with autofix                |
| `npm run typecheck` | `vue-tsc` through `nuxi typecheck` |
| `npm run test`      | Vitest unit tests (`tests/`)       |

On every commit, husky runs lint-staged: ESLint + Prettier on staged `.ts` and `.vue` files, Prettier on `.css`, `.md` and `.json`.

---

## Project Structure

```
werawoof/
├── .github/workflows/ci.yml           # Lint + typecheck + tests on push / PR to main
├── .husky/pre-commit                  # lint-staged
├── CHANGELOG.md · LICENSE
├── docs/
│   ├── adr/                           # Architecture decision records
│   ├── screenshots/                   # README images
│   ├── postmortem-2026-09-06-cutover.md
│   └── social-preview.html · .png     # GitHub social preview (rendered with Edge headless)
├── supabase/
│   ├── schema.sql                     # Tables, RLS, triggers, RPC, Realtime, Storage
│   ├── 002_get_reviews.sql            # Public reviews (security definer)
│   ├── 003_admin_dashboard.sql        # Admin dashboard aggregation
│   └── 004_drop_anon_policies.sql     # Server routes write with the secret key
│
└── frontend/
    ├── nuxt.config.ts                 # Modules, SEO head, dev port 3003, runtimeConfig
    ├── vitest.config.ts               # Unit tests without Nuxt: Nitro auto-imports stubbed
    ├── app.vue · error.vue
    ├── pages/
    │   ├── index.vue                  # Landing
    │   ├── comunidad.vue              # Public reviews
    │   ├── quienes-somos.vue          # About
    │   ├── contacto.vue               # Contact form
    │   ├── politica-de-privacidad.vue · terminos-de-servicio.vue
    │   ├── [...slug].vue              # 404
    │   ├── auth/                      # login · register · check-email · callback
    │   │                              # forgot-password · reset-password
    │   └── app/                       # Protected area (/app redirects to /app/dogs)
    │       ├── dogs/                  # index · new · [id]/edit
    │       ├── swipe/[dogId].vue      # Swiping with one of your dogs
    │       ├── matches.vue
    │       ├── chat/[id].vue          # Chat per match
    │       ├── profile.vue
    │       └── admin.vue              # Admin dashboard
    ├── components/
    │   ├── auth/AuthCard.vue          # Login / register card (email + Google)
    │   ├── layout/                    # Public and simple headers, footers, bottom nav
    │   ├── MatchCelebration.vue
    │   └── EmojiPicker.client.vue
    ├── layouts/                       # app · public · onboarding · default
    ├── middleware/                     # auth · guest · admin (route guards)
    ├── plugins/
    │   ├── auth.client.ts             # Syncs the profile with the Supabase session
    │   └── track.client.ts            # Posts page visits to /api/track
    ├── stores/                        # Pinia: auth · dogs · messages · reviews
    ├── server/
    │   ├── api/                       # contact · newsletter · track · account.delete
    │   └── utils/mail.ts              # nodemailer + Gmail SMTP
    ├── types/                         # auth · dog · match · message · review
    │   └── database.types.ts          # Generated from the Supabase schema
    ├── tests/                         # Vitest: server routes, mail utils, messages store
    │   ├── setup.ts                   # Nitro globals + nodemailer mock for every spec
    │   └── mocks/                     # #supabase/server and nodemailer fakes
    ├── assets/css/fonts.css           # Self-hosted fonts
    └── public/                        # Icons, manifest, OG image, robots.txt, llms.txt
```

---

## Data Model

All tables live in the `public` schema with Row Level Security enabled.

| Table         | Purpose                                     | Key columns                                                                                                        |
| ------------- | ------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| `profiles`    | Mirror of `auth.users`, one row per account | `id` (uuid, FK → `auth.users`), `name`, `location`, `bio`, `avatar_url`, `role` (`user` \| `admin`)                |
| `dogs`        | Dog profiles                                | `user_id`, `name`, `breed`, `age`, `sex`, `size`, `bio`, `personality_tags[]`, `photos[]`, `latitude`, `longitude` |
| `swipes`      | One swipe per ordered pair of dogs          | `swiper_id`, `swiped_id`, `direction` (`like` \| `dislike`)                                                        |
| `matches`     | Mutual likes, ordered pair (`dog1 < dog2`)  | `dog1_id`, `dog2_id`                                                                                               |
| `messages`    | Chat per match                              | `match_id`, `sender_id` (uuid), `content` (1–2000 chars)                                                           |
| `reviews`     | One review per user, public                 | `user_id` (unique), `rating` (1–5), `comment`                                                                      |
| `subscribers` | Newsletter                                  | `email` (unique)                                                                                                   |
| `page_visits` | Admin traffic stats                         | `path`, `ip`, `user_agent`, `visited_at`                                                                           |

### Functions and triggers

| Object                                    | Type                    | Role                                                                   |
| ----------------------------------------- | ----------------------- | ---------------------------------------------------------------------- |
| `handle_new_user`                         | trigger on `auth.users` | Creates the `profiles` row on sign-up (email or Google)                |
| `handle_swipe`                            | trigger on `swipes`     | Inserts a `matches` row when a like is reciprocated                    |
| `get_candidates(dog_id)`                  | RPC                     | Dogs of other users that the given dog has not swiped yet              |
| `get_reviews()`                           | RPC, security definer   | Reviews with author name and avatar for the public community page      |
| `get_admin_dashboard()`                   | RPC, security definer   | Every dashboard aggregation in one JSON payload; requires `admin` role |
| `is_admin`, `owns_dog`, `is_match_member` | helpers                 | Used by the RLS policies                                               |
| `moddatetime`                             | extension               | Keeps `updated_at` current on `profiles`, `dogs` and `reviews`         |

### Realtime and Storage

- `messages` and `matches` are in the `supabase_realtime` publication. The chat subscribes to `postgres_changes` filtered by match; the select policies decide what each client receives.
- Bucket `photos` (public read). Paths follow `{user_id}/...`; users can only upload to and delete from their own folder.

---

## Server Routes

Nitro routes under `frontend/server/api/`. They exist only for actions that need a secret.

| Method   | Route             | Body                                 | What it does                                                                                              |
| -------- | ----------------- | ------------------------------------ | --------------------------------------------------------------------------------------------------------- |
| `POST`   | `/api/contact`    | `name`, `email`, `phone?`, `message` | Emails the message to the WeraWoof inbox with the sender as reply-to                                      |
| `POST`   | `/api/newsletter` | `email`                              | Inserts the subscriber (service role), sends a welcome email and an internal notice. Duplicates return ok |
| `POST`   | `/api/track`      | `path`                               | Records the visit with IP and user agent in `page_visits`                                                 |
| `DELETE` | `/api/account`    | — (session cookie)                   | Deletes the authenticated user through the Auth admin API; the database cascade removes the rest          |

---

## Security Model

- **RLS on every table.** Logged-in users read all profiles and dogs (needed for candidates and matches) but can only write their own rows.
- **Swipes are validated in the policy:** you can only swipe with a dog you own, against a dog you do not own.
- **Matches and profiles cannot be inserted by clients.** Only the triggers create them.
- **The `role` column is not writable by users.** Update is granted per column, so nobody can promote themselves to admin.
- **Public data is exposed through `security definer` functions** (`get_reviews`, `get_admin_dashboard`) that return exactly the fields the page needs.
- **Secrets stay on the server.** The service-role key and SMTP credentials are read from `runtimeConfig` inside Nitro routes only.

---

## Deployment

### Vercel

1. Import the repository and set the **Root Directory** to `frontend`. Nuxt is detected automatically.
2. Add the five [environment variables](#environment-variables) for **Production** and **Preview**. `NUXT_PUBLIC_*` values are plain variables; the rest should be marked as sensitive.
3. Redeploy after changing any variable.
4. Make sure the production URL is in Supabase's Redirect URLs (see [Supabase Setup](#supabase-setup)).

Preview deployments load without errors, but signing in from a preview URL redirects to production unless the preview pattern is added to Supabase's Redirect URLs.

### Continuous Integration

GitHub Actions runs ESLint, `nuxi typecheck` and Vitest on every push and pull request to `main`.

### Production

| Service | URL                           |
| ------- | ----------------------------- |
| App     | https://werawoof.com          |
| Backend | Supabase (project `werawoof`) |

---

## Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feat/amazing-feature`
3. Commit following [Conventional Commits](https://www.conventionalcommits.org/): `git commit -m 'feat: add amazing feature'`
4. Push to the branch: `git push origin feat/amazing-feature`
5. Open a Pull Request

Changes are tracked in [CHANGELOG.md](CHANGELOG.md).

---

## License

Distributed under the [MIT License](LICENSE).

---

<div align="center">

Made with ❤️ for dogs everywhere

</div>
