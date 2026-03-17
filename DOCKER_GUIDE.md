# Docker Configuration Guide

This guide explains the relationship between Dockerfiles and docker-compose files in this project.

## Overview

The project uses separate configurations for **development** and **production** environments to optimize for different needs:
- **Development**: Speed and convenience for rapid iteration
- **Production**: Security, stability, and reliability

## Dockerfile vs Dockerfile.prod

These files define what code runs inside containers.

### Dockerfile (Development)
- **Purpose**: Local development with hot reload
- **Dependencies**: Installs all dependencies (dev + production)
- **Start command**: `npm run dev` (runs with nodemon/Vite)
- **User**: Runs as root (no restrictions)
- **Size**: Larger (includes dev tools like nodemon, testing frameworks)
- **Use case**: Developer convenience, rapid feedback

### Dockerfile.prod (Production)
- **Purpose**: Optimized for deployment
- **Dependencies**: Only production dependencies (`npm ci --omit=dev`)
- **Start command**: `npm start` (direct startup)
- **User**: Runs as non-root `node` user (security hardening)
- **Size**: Smaller, optimized (dev tools excluded)
- **Use case**: Safe, efficient production runtime

## docker-compose.yml vs docker-compose.prod.yml

These files orchestrate how multiple containers work together.

### docker-compose.yml (Development)

```yaml
# Optimized for developer speed
```

| Aspect | Details |
|--------|---------|
| **Data Persistence** | No volumes (fresh database each time) |
| **Source Code** | Mounts source code (`./backend:/app`) for hot reload |
| **Ports** | All ports exposed (5432, 4000, 5173) for easy access |
| **Security** | Minimal (not a concern in local dev) |
| **Restart Policy** | None (manual control) |
| **Environment** | Hardcoded example values (postgres/postgres) |
| **Health Checks** | Basic checks |

**Usage:**
```bash
docker compose up --build
```

### docker-compose.prod.yml (Production)

```yaml
# Optimized for safety and reliability
```

| Aspect | Details |
|--------|---------|
| **Data Persistence** | Named volumes persist data across restarts |
| **Source Code** | No mounts—uses built artifacts only |
| **Ports** | Only frontend port exposed; backend/DB on private network |
| **Security** | Hardened (read-only filesystems, dropped capabilities, non-root user) |
| **Restart Policy** | `unless-stopped` (auto-recovery from crashes) |
| **Environment** | Variables from `.env.prod` file (secrets kept separate) |
| **Health Checks** | Strict checks; unhealthy containers removed from rotation |
| **Networking** | Private network for backend/DB; public only for frontend |

**Usage:**
```bash
docker compose --env-file .env.prod -f docker-compose.prod.yml up --build -d
```

## How They Connect

```
Development Stack:
├── docker-compose.yml
│   ├── Uses → Dockerfile
│   ├── Code mounts: ./backend:/app, ./frontend:/app
│   ├── Hardcoded environment
│   └── All ports exposed

Production Stack:
├── docker-compose.prod.yml
│   ├── Uses → Dockerfile.prod
│   ├── No code mounts (uses built artifacts)
│   ├── Environment from .env.prod
│   └── Private network + hardening
```

## Workflow Example

### Local Development
```bash
# 1. Run development stack with hot reload
docker compose up --build

# 2. Edit code
vim backend/src/app.js

# 3. Changes appear instantly in running container
# No rebuild needed
```

### Production Deployment
```bash
# 1. Build production images
docker compose -f docker-compose.prod.yml --env-file .env.prod up --build -d

# 2. Images are optimized and hardened
# 3. Data persists in volumes
# 4. Services auto-restart on failure
# 5. Only frontend is publicly accessible
```

## Key Differences Summary

| Feature | Development | Production |
|---------|-------------|-----------|
| **Builder goal** | Fast iteration | Safe, efficient runtime |
| **Dependencies** | All (dev + prod) | Production only |
| **Data loss on restart** | Expected | Data preserved |
| **Code access** | Via volumes (live edit) | Baked into image |
| **Port exposure** | All ports public | Only necessary ports |
| **Security hardening** | Skipped | Full hardening |
| **Restart behavior** | Manual | Automatic |
| **Secret handling** | Hardcoded or local | From `.env.prod` |

## File Structure

```
project/
├── Dockerfile          # Development backend image
├── Dockerfile.prod     # Production backend image
├── docker-compose.yml  # Development stack
├── docker-compose.prod.yml  # Production stack
├── .env.prod.example   # Template for production secrets
└── backend/
    ├── Dockerfile      # Same as root Dockerfile
    ├── Dockerfile.prod # Same as root Dockerfile.prod
    └── .dockerignore
└── frontend/
    ├── Dockerfile      # Development frontend image
    ├── Dockerfile.prod # Production frontend image
    └── .dockerignore
```

## Important Notes

1. **Secrets**: Never commit `.env.prod` to git. Use `.env.prod.example` as a template.
2. **Database name**: Configured as `launch` (lowercase) for consistency.
3. **API routing**: Frontend uses `/api` proxy that works in both dev (Vite) and prod (nginx).
4. **Health checks**: Production stack verifies services are healthy before considering them running.

## When to Use Which

**Use `docker-compose.yml`:**
- Local development and testing
- When you need hot reload
- When experimenting with code

**Use `docker-compose.prod.yml`:**
- Staging/pre-production testing
- Actual production deployment
- When you need data persistence
- When you need security hardening

---

For more details, see the main README and individual Dockerfile comments.
