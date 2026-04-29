<div align="center">

# 🐾 WeraWoof

### *Conectá patitas, creá recuerdos.*

A modern matchmaking platform for dog owners — swipe, match, and chat in real time.

[![Go](https://img.shields.io/badge/Go-1.21+-00ADD8?style=flat-square&logo=go&logoColor=white)](https://golang.org)
[![Nuxt](https://img.shields.io/badge/Nuxt-3-00DC82?style=flat-square&logo=nuxt.js&logoColor=white)](https://nuxt.com)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?style=flat-square&logo=postgresql&logoColor=white)](https://www.postgresql.org)
[![Redis](https://img.shields.io/badge/Redis-7-DC382D?style=flat-square&logo=redis&logoColor=white)](https://redis.io)
[![Docker](https://img.shields.io/badge/Docker-ready-2496ED?style=flat-square&logo=docker&logoColor=white)](https://docker.com)

[Live Demo](https://werawoof.vercel.app) · [API](https://werawoof-production.up.railway.app) · [Report Bug](https://github.com) · [Request Feature](https://github.com)

</div>

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Running in Development](#running-in-development)
- [Project Structure](#project-structure)
- [API Reference](#api-reference)
- [Data Models](#data-models)
- [Real-Time Features](#real-time-features)
- [Deployment](#deployment)
- [Contributing](#contributing)

---

## Overview

**WeraWoof** is a full-stack web application inspired by Tinder — but for dogs. Dog owners can create detailed profiles for their pets, swipe on other dogs, get matched when both sides like each other, and chat in real time with the other owner.

The name comes from *Wera*, a real dog that inspired the project. Built as a learning platform to master Go, Vue 3, and modern backend architecture.

---

## Features

### 🐕 Dog Profiles
- Create and manage profiles for multiple dogs per account
- Add breed, age, sex, size, bio, and personality tags
- Upload multiple photos per dog (Cloudinary or local)
- Geolocation support for proximity-based matching

### 💘 Swipe & Match
- Like or dislike other dogs
- Automatic match creation on mutual like
- Candidate feed excludes already-swiped dogs
- Match celebration UI on new match

### 💬 Real-Time Chat
- WebSocket-based messaging per match
- Message history persistence
- Emoji picker support
- Multi-dog account support (each match is scoped per dog pair)

### 🔔 Notifications
- Server-Sent Events (SSE) for instant notifications
- Events: `new_match`, `new_message`
- Per-user notification channels via broker pattern

### 🔐 Authentication & Security
- Email/password registration with bcrypt hashing
- JWT authentication with configurable expiration
- Token blacklisting on logout (Redis)
- Google OAuth 2.0
- Email verification on signup
- Password reset via email

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Backend Language** | Go 1.21+ |
| **Backend Framework** | Gin |
| **Database** | PostgreSQL 16 |
| **ORM** | GORM |
| **Cache / Sessions** | Redis 7 |
| **Real-Time** | WebSocket (Gorilla), Server-Sent Events |
| **Auth** | JWT, bcrypt, Google OAuth 2.0 |
| **File Storage** | Cloudinary (with local fallback) |
| **Email** | Gmail SMTP via gomail |
| **Frontend Framework** | Nuxt 3 + Vue 3 |
| **Language** | TypeScript |
| **State Management** | Pinia |
| **Styling** | Tailwind CSS |
| **Containerization** | Docker + Docker Compose |
| **CI/CD** | GitHub Actions |
| **Hosting** | Railway (backend + DB), Vercel (frontend) |

---

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                        CLIENT                           │
│              Nuxt 3 + Vue 3 + TypeScript                │
│         (Pinia · Tailwind CSS · WebSocket · SSE)        │
└──────────────────────────┬──────────────────────────────┘
                           │ HTTP / WS / SSE
┌──────────────────────────▼──────────────────────────────┐
│                    BACKEND (Go + Gin)                   │
│                                                         │
│  ┌─────────────┐  ┌─────────────┐  ┌────────────────┐  │
│  │  Handlers   │  │  Services   │  │  Repositories  │  │
│  │ (HTTP layer)│→ │(business    │→ │  (data access) │  │
│  │             │  │  logic)     │  │                │  │
│  └─────────────┘  └─────────────┘  └────────────────┘  │
│                                                         │
│  ┌─────────────┐  ┌─────────────┐  ┌────────────────┐  │
│  │  WS Hub     │  │ SSE Broker  │  │  Middleware    │  │
│  │ (real-time  │  │(push notif.)│  │  (JWT auth)   │  │
│  │   chat)     │  │             │  │                │  │
│  └─────────────┘  └─────────────┘  └────────────────┘  │
└────────┬──────────────────┬────────────────────────┬────┘
         │                  │                        │
┌────────▼──────┐  ┌────────▼──────┐  ┌─────────────▼──┐
│  PostgreSQL   │  │     Redis     │  │   Cloudinary   │
│  (main data)  │  │ (token BL +   │  │  (file upload) │
│               │  │  sessions)    │  │                │
└───────────────┘  └───────────────┘  └────────────────┘
```

### Design Patterns

- **Layered Architecture** — Handlers → Services → Repositories
- **Repository Pattern** — data access abstracted behind interfaces
- **Hub Pattern** — WebSocket connection management
- **Broker Pattern** — fan-out event publishing for SSE
- **Dependency Injection** — constructor-based DI throughout
- **Middleware** — JWT auth as Gin middleware

---

## Getting Started

### Prerequisites

Make sure you have the following installed:

- [Go 1.21+](https://golang.org/dl/)
- [Node.js 20+](https://nodejs.org/) and npm
- [Docker + Docker Compose](https://docs.docker.com/get-docker/)
- [Git](https://git-scm.com/)

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/werawoof.git
cd werawoof

# Install frontend dependencies
cd frontend && npm install && cd ..
```

### Environment Variables

Create a `.env` file in the project root. Here is the full reference:

| Variable | Description |
|---|---|
| `APP_ENV` | Application environment (`development` \| `production`) |
| `APP_PORT` | Port the backend listens on |
| `FRONTEND_URL` | Frontend base URL (for CORS and redirects) |
| `DATABASE_URL` | Full PostgreSQL connection string |
| `POSTGRES_DB` | Database name (used by Docker) |
| `POSTGRES_USER` | Database user (used by Docker) |
| `POSTGRES_PASSWORD` | Database password (used by Docker) |
| `REDIS_URL` | Redis connection string |
| `JWT_SECRET` | Secret key for signing JWT tokens |
| `JWT_EXPIRATION_HOURS` | Token lifetime in hours |
| `GOOGLE_CLIENT_ID` | Google OAuth 2.0 client ID |
| `GOOGLE_CLIENT_SECRET` | Google OAuth 2.0 client secret |
| `GOOGLE_REDIRECT_URL` | OAuth callback URL registered in Google Console |
| `GMAIL_USER` | Gmail address used to send emails |
| `GMAIL_APP_PASSWORD` | Gmail App Password (not your account password) |
| `GMAIL_FROM` | Display name + address for outgoing emails |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |
| `CLOUDINARY_FOLDER` | Folder name inside your Cloudinary account |

> **Note:** For Google OAuth, create credentials at [Google Cloud Console](https://console.cloud.google.com). For Gmail SMTP, generate an [App Password](https://myaccount.google.com/apppasswords) with 2FA enabled.

### Running in Development

Open **three terminals**:

**Terminal 1 — Infrastructure (PostgreSQL + Redis)**
```bash
docker compose up postgres redis
```

**Terminal 2 — Backend**
```bash
cd backend
go run ./cmd/main.go
```

**Terminal 3 — Frontend**
```bash
cd frontend
npm run dev
```

| Service | URL |
|---|---|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:3004 |
| Health check | http://localhost:3004/health |
| Swagger UI | http://localhost:3004/swagger/index.html |

---

## Project Structure

```
werawoof/
├── backend/
│   ├── cmd/
│   │   └── main.go                   # Entry point
│   ├── internal/
│   │   ├── config/
│   │   │   └── config.go             # Config loading from env
│   │   ├── domain/
│   │   │   ├── user.go               # User model
│   │   │   ├── dog.go                # Dog model
│   │   │   ├── match.go              # Swipe + Match models
│   │   │   └── message.go            # Message model
│   │   ├── handler/
│   │   │   ├── auth_handler.go       # Register, login, logout
│   │   │   ├── oauth_handler.go      # Google OAuth
│   │   │   ├── user_handler.go       # Profile management
│   │   │   ├── dog_handler.go        # Dog CRUD + photos
│   │   │   ├── swipe_handler.go      # Swipe + candidates + matches
│   │   │   ├── chat_handler.go       # WebSocket + message history
│   │   │   ├── sse_handler.go        # SSE notifications
│   │   │   ├── verification_handler.go
│   │   │   ├── contact_handler.go
│   │   │   └── health.go
│   │   ├── middleware/
│   │   │   └── auth.go               # JWT validation middleware
│   │   ├── repository/
│   │   │   ├── user_repository.go
│   │   │   ├── dog_repository.go
│   │   │   ├── swipe_repository.go
│   │   │   └── message_repository.go
│   │   └── service/
│   │       ├── auth_service.go
│   │       ├── oauth_service.go
│   │       ├── user_service.go
│   │       ├── dog_service.go
│   │       ├── swipe_service.go
│   │       ├── chat_service.go
│   │       ├── email_service.go
│   │       └── verification_service.go
│   └── pkg/
│       ├── cloudinary/               # File upload integration
│       ├── database/                 # DB connection + migrations
│       ├── hub/                      # WebSocket hub
│       ├── redis/                    # Redis client + token blacklist
│       └── sse/                      # SSE broker
│
└── frontend/
    ├── pages/
    │   ├── index.vue                 # Landing page
    │   ├── auth/                     # Login, register, reset
    │   └── app/                      # Protected app routes
    │       ├── index.vue             # Dashboard
    │       ├── dogs/                 # Dog management
    │       ├── swipe/[dogId].vue     # Swiping interface
    │       ├── matches.vue           # Matches list
    │       └── chat/[id].vue         # Chat per match
    ├── components/
    │   ├── auth/
    │   ├── dog/
    │   ├── layout/
    │   └── ui/
    ├── stores/
    │   ├── auth.ts                   # Auth state (Pinia)
    │   └── dogs.ts                   # Dogs state (Pinia)
    ├── services/
    │   └── api.ts                    # HTTP client wrapper
    ├── middleware/
    │   ├── auth.ts                   # Redirect unauthenticated
    │   └── guest.ts                  # Redirect authenticated
    ├── layouts/
    │   ├── app.vue                   # Authenticated layout
    │   ├── public.vue                # Public layout
    │   └── onboarding.vue
    └── types/                        # TypeScript interfaces
```

---

## API Reference

All protected endpoints require:
```
Authorization: Bearer <token>
```

### Authentication

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/auth/register` | ❌ | Register with email and password |
| `POST` | `/auth/login` | ❌ | Login, returns JWT token |
| `POST` | `/auth/logout` | ✅ | Invalidates current token |
| `GET` | `/auth/google` | ❌ | Redirect to Google OAuth |
| `GET` | `/auth/google/callback` | ❌ | Google OAuth callback |
| `GET` | `/auth/verify` | ❌ | Verify email with token |
| `POST` | `/auth/forgot-password` | ❌ | Send password reset email |
| `POST` | `/auth/reset-password` | ❌ | Reset password with token |

### Users

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/me` | ✅ | Get authenticated user profile |
| `PUT` | `/api/me` | ✅ | Update profile (name, location, bio) |
| `POST` | `/api/me/avatar` | ✅ | Upload profile avatar |

### Dogs

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/dogs` | ✅ | List all dogs owned by the user |
| `POST` | `/api/dogs` | ✅ | Create a new dog profile |
| `GET` | `/api/dogs/:id` | ✅ | Get a specific dog |
| `PUT` | `/api/dogs/:id` | ✅ | Update dog profile |
| `DELETE` | `/api/dogs/:id` | ✅ | Delete dog profile |
| `POST` | `/api/dogs/:id/photos` | ✅ | Upload a photo for a dog |

### Swipe & Matching

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/swipe` | ✅ | Perform a swipe (like/dislike) |
| `GET` | `/api/dogs/:id/candidates` | ✅ | Get candidate dogs for swiping |
| `GET` | `/api/dogs/:id/matches` | ✅ | Get all matches for a dog |

### Chat

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/ws` | ✅ | Open WebSocket connection |
| `GET` | `/api/matches/:match_id/messages` | ✅ | Get message history |

### Notifications

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/notifications` | ✅ | Open SSE stream for push notifications |

### Other

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/health` | ❌ | Health check |
| `POST` | `/contact` | ❌ | Submit contact form |
| `GET` | `/swagger/*any` | ❌ | Swagger UI |

---

### Example Requests

**Register**
```bash
curl -X POST http://localhost:3004/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name": "John Doe", "email": "john@example.com", "password": "secret123"}'
```

**Create Dog**
```bash
curl -X POST http://localhost:3004/api/dogs \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Wera",
    "breed": "Labrador",
    "age": 2,
    "sex": "female",
    "size": "large",
    "bio": "Playful and loves other dogs!",
    "personality_tags": ["playful", "energetic", "friendly"],
    "latitude": -34.6037,
    "longitude": -58.3816
  }'
```

**Swipe**
```bash
curl -X POST http://localhost:3004/api/swipe \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"swiper_dog_id": 1, "swiped_dog_id": 2, "direction": "like"}'
```

---

## Data Models

### User
| Field | Type | Notes |
|---|---|---|
| `id` | uint | Primary key |
| `email` | string | Unique |
| `name` | string | |
| `location` | string | |
| `bio` | string | |
| `avatar` | string | URL |
| `google_id` | string | Unique, OAuth users |
| `verified` | bool | Email verification status |
| `created_at` | timestamp | |
| `updated_at` | timestamp | |

### Dog
| Field | Type | Notes |
|---|---|---|
| `id` | uint | Primary key |
| `user_id` | uint | FK → User |
| `name` | string | |
| `breed` | string | |
| `age` | int | |
| `sex` | string | `"male"` \| `"female"` |
| `size` | string | `"small"` \| `"medium"` \| `"large"` |
| `bio` | string | |
| `personality_tags` | string[] | PostgreSQL array |
| `photos` | string[] | PostgreSQL array of URLs |
| `latitude` | float64 | |
| `longitude` | float64 | |

### Swipe
| Field | Type | Notes |
|---|---|---|
| `id` | uint | Primary key |
| `swiper_id` | uint | FK → Dog (who swiped) |
| `swiped_id` | uint | FK → Dog (who was swiped) |
| `direction` | string | `"like"` \| `"dislike"` |
| `created_at` | timestamp | |

### Match
| Field | Type | Notes |
|---|---|---|
| `id` | uint | Primary key |
| `dog1_id` | uint | FK → Dog |
| `dog2_id` | uint | FK → Dog |
| `created_at` | timestamp | |

### Message
| Field | Type | Notes |
|---|---|---|
| `id` | uint | Primary key |
| `match_id` | uint | FK → Match |
| `sender_id` | uint | FK → User |
| `content` | string | |
| `created_at` | timestamp | |

---

## Real-Time Features

### WebSocket (Chat)

Connect to `ws://localhost:3004/api/ws`. Send messages in this format:

```json
{
  "match_id": 1,
  "content": "Hola! ¿Cuándo podemos hacer un playdate?"
}
```

The Hub manages all active connections and routes messages to the correct match participants.

### Server-Sent Events (Notifications)

Connect to `GET /api/notifications` — the server streams events as they happen:

```
event: new_match
data: {"match_id": 5, "dog_name": "Rocky"}

event: new_message
data: {"match_id": 5, "sender": "John", "preview": "Hola!"}
```

---

## Deployment

### Production URLs

| Service | URL |
|---|---|
| Frontend | https://werawoof.vercel.app |
| Backend API | https://werawoof-production.up.railway.app |

### Full Stack with Docker

```bash
docker compose up --build
```

| Container | Internal Port | External Port |
|---|---|---|
| `werawoof-postgres` | 5432 | 5433 |
| `werawoof-redis` | 6379 | 6379 |
| `werawoof-backend` | 3004 | 3004 |
| `werawoof-frontend` | 3000 | 3003 |

### Backend (Railway)

- Go buildpack auto-detected
- PostgreSQL + Redis as Railway plugins
- Environment variables set via Railway dashboard

### Frontend (Vercel)

- Nuxt 3 preset auto-detected
- Set `NUXT_PUBLIC_API_BASE` to the Railway backend URL

---

## Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feat/amazing-feature`
3. Commit your changes following [Conventional Commits](https://www.conventionalcommits.org/): `git commit -m 'feat: add amazing feature'`
4. Push to the branch: `git push origin feat/amazing-feature`
5. Open a Pull Request

---

<div align="center">

Made with ❤️ for dogs everywhere

</div>
