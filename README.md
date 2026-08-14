<div align="center">

# ⚡ Ersin Portfolio & High-Performance API Platform

[![Python](https://img.shields.io/badge/Python-3.12-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
[![Django](https://img.shields.io/badge/Django-4.0.6-092E20?style=for-the-badge&logo=django&logoColor=white)](https://www.djangoproject.com/)
[![Django REST Framework](https://img.shields.io/badge/DRF-3.15.1-A30000?style=for-the-badge&logo=django&logoColor=white)](https://www.django-rest-framework.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Redis](https://img.shields.io/badge/Redis-7.0-DC382D?style=for-the-badge&logo=redis&logoColor=white)](https://redis.io/)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)
[![CI Status](https://img.shields.io/badge/CI-Passing-brightgreen?style=for-the-badge&logo=githubactions&logoColor=white)](.github/workflows/ci.yml)
[![License](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](LICENSE)

<p align="center">
  <strong>Enterprise-grade portfolio platform, RESTful content delivery engine, and high-concurrency web service built with Django, Redis-backed throttling, containerized microservices, and interactive canvas physics.</strong>
</p>

<p align="center">
  <a href="#-system-architecture">Architecture</a> •
  <a href="#-api--interface-specifications">API Specifications</a> •
  <a href="#-quickstart--developer-experience">Quickstart</a> •
  <a href="#-containerized-deployment">Docker & Compose</a> •
  <a href="#-testing--quality-assurance">Testing</a> •
  <a href="#-production-operations--security">Production & Security</a> •
  <a href="#-repository-structure">Project Structure</a>
</p>

</div>

---

## 📌 Executive Overview

This repository houses the production codebase for **ersin.dev** — a decoupled, high-performance web platform and portfolio API. Designed with reliability, security, and developer ergonomics as primary tenets, the system pairs a hardened **Django 4.0.6 + DRF** backend with a lightweight, zero-dependency **HTML5/ES6+ Canvas** interactive frontend.

### Key Engineering Highlights

* **Multi-Tier Caching Architecture**: Full-page response caching (`@cache_page` via Redis) combined with in-memory fallback (`LocMemCache`) for sub-millisecond local latency.
* **Granular IP Rate Limiting**: Distributed sliding-window throttling (max 3 contact submissions/hour per IP) preventing spam vector attacks without degrading legitimate traffic.
* **Hardened Security Profile**: Enterprise-tier HTTP security headers (HSTS Preload with 1-year max-age, `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, obfuscated admin endpoints).
* **Decoupled Settings Hierarchy**: Strict separation between `base.py`, `dev.py`, and `prod.py` driven by Twelve-Factor environment variable injection.
* **Production-Ready Containerization**: Multi-stage Docker Compose ecosystem orchestrating `web` (Gunicorn), `db` (PostgreSQL 15-Alpine), and `redis` (Redis 7-Alpine) with automated database migration and static asset aggregation.
* **Interactive Frontend Engine**: Custom 60fps particle physics engine and Catmull-Rom spline snake parallax rendering without heavy third-party UI framework overhead.

---

## 🏛️ System Architecture

### High-Level Component Topology

```mermaid
flowchart TD
    Client(["🌐 Client / Browser"]) -->|HTTPS:443| RevProxy["🛡️ Reverse Proxy / Load Balancer\n(Nginx / Cloudflare)"]
    RevProxy -->|HTTP:8000| Gunicorn["⚙️ Gunicorn WSGI Server\n(Pre-fork Workers)"]
    
    subgraph Django Core ["📦 Django Application Runtime"]
        Gunicorn --> SecurityMW["🛡️ Security & CSRF Middleware"]
        SecurityMW --> Router["🔀 URL Dispatcher"]
        
        Router -->|GET /| ViewCache{"⚡ Redis L1 Page Cache\n(TTL: 15m)"}
        ViewCache -->|Hit| FastReturn["🚀 Cached HTML Response"]
        ViewCache -->|Miss| IndexView["📄 Intro View + Context Processors"]
        
        Router -->|POST /contact/send/| RateLimit{"⏱️ Redis L2 Throttler\n(3 req/hr/IP)"}
        RateLimit -->|Exceeded| Res429["🛑 HTTP 429 Too Many Requests"]
        RateLimit -->|Allowed| ContactView["✉️ Sanitization & Message Ingestion"]
        
        Router -->|GET /api/projects/| DRFView["🔌 DRF Portfolio Project ViewSet"]
        Router -->|GET /secret-hq-admin/| JazzminAdmin["🎛️ Jazzmin HQ Admin Portal"]
    end
    
    IndexView --> DB[("🗄️ PostgreSQL 15 / SQLite3\n(Persistent Storage)")]
    ContactView --> DB
    DRFView --> DB
    
    ContactView --> RedisInstance[("⚡ Redis 7-Alpine\n(Cache & Throttling Store)")]
    ViewCache --> RedisInstance
    RateLimit --> RedisInstance
```

### Data Flow Sequence: Contact Form Submission & Throttling

```mermaid
sequenceDiagram
    autonumber
    actor User as Client Browser
    participant API as Django (/contact/send/)
    participant Redis as Redis Cache Cluster
    participant DB as PostgreSQL Database

    User->>API: POST /contact/send/ {name, email, message} + CSRF
    API->>API: Extract Client IP (REMOTE_ADDR)
    API->>Redis: GET contact_limit_{IP}
    
    alt Attempts >= 3
        Redis-->>API: attempts = 3
        API-->>User: HTTP 429 {status: 'error', message: 'Too many requests...'}
    else Attempts < 3
        Redis-->>API: attempts = N (0..2)
        API->>API: HTML Entity Escape & String Length Validation
        alt Validation Failure
            API-->>User: HTTP 400 {status: 'error', message: 'Validation error'}
        else Validation Succeeded
            API->>DB: ContactMessage.objects.create(...)
            DB-->>API: Row Created (id, created_at)
            API->>Redis: SET contact_limit_{IP} = N + 1 (EX = 3600s)
            API-->>User: HTTP 200 {status: 'success', message: 'Message transmitted...'}
        end
    end
```

### Technical Trade-Offs & Design Decisions

| Component | Technical Decision | Trade-Off Rationale | Alternative Evaluated |
| :--- | :--- | :--- | :--- |
| **Concurrency Model** | Gunicorn Sync Pre-fork Workers | Highly reliable, predictable memory bounds, simple deployment. CPU-bound and fast I/O workloads execute with minimal overhead. | ASGI / Uvicorn (Deferred until WebSockets or async background tasks are required). |
| **Caching Engine** | Redis 7 + `LocMemCache` fallback | Redis provides unified distributed caching across multiple web instances in production, while `LocMemCache` eliminates external dependencies for developer workstations. | Memcached (Lacks persistent primitives and key-space isolation). |
| **Rate Limiter** | Redis Key-TTL Sliding Windows | Low-latency atomic counter increments directly within the view without requiring heavy third-party rate limiting middleware. | Django-Ratelimit package (Added external dependency overhead). |
| **Frontend Stack** | Vanilla HTML5 / ES6+ Canvas | Zero-dependency compilation step, instantaneous page loads, zero React/Vue runtime hydration penalty, full control over canvas rendering loops. | Next.js / React SPA (Increased bundle size and runtime complexity). |

---

## 🔌 API & Interface Specifications

All REST endpoints adhere to RFC 7807 problem details standards and return standardized JSON responses.

### Base URLs
* **Production API Base**: `https://ersin.dev/api/`
* **Local Development Base**: `http://127.0.0.1:8000/api/`

---

### 1. List Portfolio Projects

Retrieves a paginated list of all published portfolio projects sorted in reverse chronological order.

* **Endpoint**: `GET /api/projects/`
* **Authentication**: None (Public Read-Only)
* **Headers**: `Accept: application/json`

#### Response (`HTTP 200 OK`)

```json
[
  {
    "id": 1,
    "title": "Autonomous Neural Agent Orchestrator",
    "description": "Distributed task planning and tool-use framework powered by LLM subagent swarms and vector memory indexation.",
    "image": "https://ersin.dev/media/portfolio/neural_agent.webp",
    "tech_tags": "Python, PyTorch, FastAPI, Redis, Docker",
    "github_url": "https://github.com/ersin2/neural-orchestrator",
    "live_url": "https://agent.ersin.dev",
    "created_at": "2026-08-10T14:30:00Z"
  },
  {
    "id": 2,
    "title": "Distributed Financial Ledger",
    "description": "High-throughput double-entry transactional engine capable of processing 15,000 TPS with ACID guarantees.",
    "image": "https://ersin.dev/media/portfolio/ledger.webp",
    "tech_tags": "Python, Django, PostgreSQL, Celery, Kafka",
    "github_url": "https://github.com/ersin2/distributed-ledger",
    "live_url": null,
    "created_at": "2026-07-28T09:15:00Z"
  }
]
```

---

### 2. Retrieve Portfolio Project by ID

Fetches complete metadata for an individual project by its primary key.

* **Endpoint**: `GET /api/projects/{id}/`
* **Parameters**: `id` (integer, required) — Primary key ID of the project.
* **Authentication**: None

#### Response (`HTTP 200 OK`)

```json
{
  "id": 1,
  "title": "Autonomous Neural Agent Orchestrator",
  "description": "Distributed task planning and tool-use framework powered by LLM subagent swarms and vector memory indexation.",
  "image": "https://ersin.dev/media/portfolio/neural_agent.webp",
  "tech_tags": "Python, PyTorch, FastAPI, Redis, Docker",
  "github_url": "https://github.com/ersin2/neural-orchestrator",
  "live_url": "https://agent.ersin.dev",
  "created_at": "2026-08-10T14:30:00Z"
}
```

#### Error Response (`HTTP 404 Not Found`)

```json
{
  "detail": "Not found."
}
```

---

### 3. Contact Ingestion & Direct Message Transmission

Accepts inquiries, validates payload bounds, sanitizes input strings, applies IP-based rate limiting, and persists messages to the administrative inbox.

* **Endpoint**: `POST /contact/send/`
* **Content-Type**: `multipart/form-data` or `application/x-www-form-urlencoded`
* **Authentication**: CSRF Token validation required for browser clients.

#### Request Parameters

| Parameter | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `name` | `string` | **Required**, max 100 chars | Name of the sender. |
| `email` | `string` | **Required**, valid email, max 150 chars | Contact email address. |
| `message` | `string` | **Required**, max 5000 chars | Body content of the inquiry. |
| `csrfmiddlewaretoken` | `string` | **Required** (Browser form) | Anti-CSRF security token. |

#### Successful Submission Response (`HTTP 200 OK`)

```json
{
  "status": "success",
  "message": "Message transmitted successfully."
}
```

#### Validation Failure Response (`HTTP 400 Bad Request`)

```json
{
  "status": "error",
  "message": "All fields (Name, Email, Message) are required."
}
```

#### Rate Limit Exceeded Response (`HTTP 429 Too Many Requests`)

```json
{
  "status": "error",
  "message": "Too many requests. Please try again later."
}
```

---

## 💻 Client Integration Examples

### cURL

```bash
# 1. Fetch public project portfolio
curl -X GET "http://127.0.0.1:8000/api/projects/" \
     -H "Accept: application/json"

# 2. Submit contact inquiry
curl -X POST "http://127.0.0.1:8000/contact/send/" \
     -H "X-CSRFToken: <YOUR_CSRF_TOKEN>" \
     -d "name=Alex+Vance" \
     -d "email=alex@example.com" \
     -d "message=Inquiring+about+backend+architecture+consulting."
```

### Python (`httpx` / `requests`)

```python
import httpx

API_BASE = "https://ersin.dev/api"

def get_projects() -> list[dict]:
    with httpx.Client(base_url=API_BASE, timeout=10.0) as client:
        response = client.get("/projects/")
        response.raise_for_status()
        return response.json()

if __name__ == "__main__":
    projects = get_projects()
    for p in projects:
        print(f"[{p['id']}] {p['title']} -> {p['tech_tags']}")
```

### TypeScript (`fetch`)

```typescript
interface Project {
  id: number;
  title: string;
  description: string;
  image: string | null;
  tech_tags: string;
  github_url: string | null;
  live_url: string | null;
  created_at: string;
}

async function fetchProjects(): Promise<Project[]> {
  const res = await fetch("https://ersin.dev/api/projects/", {
    headers: { "Accept": "application/json" }
  });
  
  if (!res.ok) {
    throw new Error(`Failed to load projects: ${res.statusText}`);
  }
  
  return res.json();
}
```

---

## 🚀 Quickstart & Developer Experience

Follow these instructions to run the application in a local development environment.

### Prerequisites

* **Python**: `3.12+`
* **Package Manager**: `pip` (or `pipenv` / `poetry`)
* **Git**: `2.40+`
* **Optional**: Redis local server (Development defaults to in-memory `LocMemCache`)

### 1. Clone & Set Up Virtual Environment

```bash
# Clone the repository
git clone https://github.com/ersin2/mysite.git
cd mysite

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Linux/macOS:
source venv/bin/activate
# On Windows (PowerShell):
.\venv\Scripts\Activate.ps1
```

### 2. Install Dependencies

```bash
python -m pip install --upgrade pip
pip install -r requirements.txt
```

### 3. Environment Configuration

Create a `.env` file in the root directory:

```ini
# Core Settings
DEBUG=True
SECRET_KEY=dev-insecure-secret-key-change-in-production
DJANGO_SETTINGS_MODULE=mysite.settings.dev

# Database Configuration (Defaults to SQLite in local dev)
# DATABASE_URL=postgres://ersin:pentagonsecure@localhost:5432/portfolio

# Redis Configuration (Optional in local dev; falls back to in-memory cache)
REDIS_URL=redis://127.0.0.1:6379/1
ALLOWED_HOSTS=localhost,127.0.0.1
```

### 4. Database Migrations & Superuser Creation

```bash
# Run database schema migrations
python manage.py migrate

# Create administrative superuser
python manage.py createsuperuser
```

### 5. Launch Development Server

```bash
python manage.py runserver 127.0.0.1:8000
```

Access the application:
* **Frontend Application**: [http://127.0.0.1:8000/](http://127.0.0.1:8000/)
* **REST API Endpoint**: [http://127.0.0.1:8000/api/projects/](http://127.0.0.1:8000/api/projects/)
* **Admin Dashboard (Jazzmin HQ)**: [http://127.0.0.1:8000/secret-hq-admin/](http://127.0.0.1:8000/secret-hq-admin/)

---

## 🐳 Containerized Deployment

The platform provides a production-grade multi-container topology orchestrating the application server, PostgreSQL 15 database, and Redis 7 cache.

```
┌─────────────────────────────────────────────────────────────┐
│                    Docker Compose Mesh                      │
│                                                             │
│  ┌────────────────┐     ┌────────────────┐     ┌─────────┐  │
│  │   web:8000     │────▶│   db:5432      │     │ redis   │  │
│  │ (Gunicorn+App) │     │ (Postgres 15)  │     │ (:6379) │  │
│  └───────┬────────┘     └───────┬────────┘     └───▲─────┘  │
│          │                      │                  │        │
│          ▼                      ▼                  │        │
│   [Static / Media]     [postgres_data]             │        │
│    Shared Volumes       Persisted Volume           │        │
│          │                                         │        │
│          └─────────────────────────────────────────┘        │
└─────────────────────────────────────────────────────────────┘
```

### Deploying with Docker Compose

```bash
# 1. Build images and start all service containers in background
docker compose up --build -d

# 2. Inspect container status
docker compose ps

# 3. Stream real-time logs from web server
docker compose logs -f web

# 4. Execute database migrations manually (if not handled by entrypoint)
docker compose exec web python manage.py migrate

# 5. Create superuser inside container
docker compose exec -it web python manage.py createsuperuser

# 6. Graceful shutdown
docker compose down
```

> [!NOTE]
> The container entrypoint script (`entrypoint.sh`) automatically executes `python manage.py migrate` and `python manage.py collectstatic --noinput` prior to initiating the Gunicorn application server.

---

## 🧪 Testing & Quality Assurance

The test suite is powered by **Pytest** and **pytest-django**, featuring isolated database transactions and automated cache teardown.

### Running Test Suites

```bash
# Run entire test suite
pytest

# Run tests with detailed verbose output
pytest -v

# Run contact rate-limiting tests specifically
pytest apps/contact/tests.py

# Run with test coverage reporting
pytest --cov=apps --cov-report=term-missing
```

### Test Coverage Highlights

* `test_successful_submission`: Validates complete transactional write to `ContactMessage` model and 200 OK response.
* `test_missing_fields`: Asserts strict 400 Bad Request when required attributes (`name`, `email`, `message`) are missing.
* `test_rate_limiter`: Simulates burst traffic; ensures exact enforcement of the 3-request limit and validates HTTP 429 status code on 4th attempt.
* `test_length_validation`: Validates protection against buffer overruns or payload stuffing attacks exceeding model bounds.

---

## 🔒 Production Operations & Security

### Environment Variables Reference

| Variable | Type | Default / Example | Description |
| :--- | :--- | :--- | :--- |
| `DJANGO_SETTINGS_MODULE` | `string` | `mysite.settings.prod` | Python path to active settings configuration module. |
| `SECRET_KEY` | `string` | *(Cryptographic string)* | Cryptographic signing key for sessions, CSRF, and tokens. |
| `DEBUG` | `boolean` | `False` | Must remain `False` in all production deployments. |
| `ALLOWED_HOSTS` | `string` | `ersin.dev,www.ersin.dev` | Comma-separated domain names allowed to serve requests. |
| `DATABASE_URL` | `string` | `postgres://user:pass@host:5432/db` | Connection URI parsed by `dj-database-url`. |
| `REDIS_URL` | `string` | `redis://redis:6379/1` | Redis connection URL for page cache and rate limiter. |

### Enterprise Security Safeguards

> [!IMPORTANT]
> **Strict SSL & HSTS Policy**
> In production (`mysite.settings.prod`), HTTP requests are automatically redirected to HTTPS. `SECURE_HSTS_SECONDS` is set to `31536000` (1 year) with `includeSubDomains` and `preload` flags enabled.

> [!WARNING]
> **Admin Endpoint Obfuscation**
> The default `/admin/` URL route is disabled and moved to `/secret-hq-admin/` to mitigate credential stuffing and automated bot scanning attacks.

### Production Checklist

- [ ] Ensure `DEBUG=False` is set in the runtime environment.
- [ ] Generate a secure, high-entropy `SECRET_KEY` (`openssl rand -base64 48`).
- [ ] Connect a managed PostgreSQL instance with connection pooling enabled (`conn_max_age=600`).
- [ ] Configure a persistent Redis instance for distributed caching and rate-limiting.
- [ ] Set up TLS certificates (Let's Encrypt / Cloudflare) with automated renewal.
- [ ] Configure persistent storage or S3 bucket for `media/` uploads.

---

## 📂 Repository Structure

```tree
mysite/
├── .github/
│   └── workflows/
│       └── ci.yml                   # GitHub Actions automated test & CI pipeline
├── apps/
│   ├── about_me/                    # Biography and technical profile application
│   │   ├── admin.py                 # Admin registration
│   │   ├── models.py                # About me database models
│   │   └── views.py                 # About me presentation logic
│   ├── contact/                     # Secure messaging and inquiry application
│   │   ├── admin.py                 # Contact message admin views with search
│   │   ├── models.py                # Contact info & ContactMessage entities
│   │   ├── tests.py                 # Rate-limiting & validation test suite
│   │   └── views.py                 # AJAX handler with Redis rate limiting & XSS escaping
│   ├── intro/                       # Core hero, landing page, and global contexts
│   │   ├── context_processors.py    # Global site settings injector
│   │   ├── models.py                # Hero section metadata
│   │   └── views.py                 # 15-min cached landing page controller
│   └── my_portfolio/                # REST API and project catalogue application
│       ├── admin.py                 # Portfolio management in Jazzmin admin
│       ├── api_views.py             # DRF ReadOnlyModelViewSet for projects
│       ├── models.py                # PortfolioProject schema
│       └── serializers.py           # ModelSerializer for REST endpoints
├── mysite/                          # Django project configuration root
│   ├── settings/
│   │   ├── base.py                  # Common configuration & Jazzmin UI definitions
│   │   ├── dev.py                   # Local development settings (LocMemCache, debug on)
│   │   └── prod.py                  # Hardened production settings (Postgres, HSTS, Logging)
│   ├── asgi.py                      # ASGI entrypoint for async capabilities
│   ├── urls.py                      # Master URL routing table & API registrations
│   └── wsgi.py                      # WSGI entrypoint for Gunicorn
├── static/                          # Static asset distribution
│   ├── css/
│   │   └── style.css                # Custom CSS design system (Glassmorphism & animations)
│   ├── js/
│   │   └── main.js                  # Particle engine, Catmull-Rom snake, 3D tilt & AJAX
│   └── img/                         # Static icons, logos, and vector assets
├── template/
│   ├── index.html                   # Master portfolio single-page application template
│   └── robots.txt                   # Search engine crawling rules
├── .dockerignore                    # Docker build exclusion rules
├── .env                             # Environment variable definitions (Git-ignored)
├── .gitignore                       # Git version control exclusions
├── Dockerfile                       # Multi-stage Python 3.12 container definition
├── docker-compose.yml               # Multi-service stack (Web + PostgreSQL + Redis)
├── entrypoint.sh                    # Container bootstrapper (Migrations & collectstatic)
├── manage.py                        # Django administrative CLI wrapper
├── pytest.ini                       # Pytest configuration and database reuse flags
├── requirements.txt                 # Pinned project dependencies
└── README.md                        # Project documentation and engineering guide
```

---

## 👥 Authors & Maintainers

* **Ersin** — *Lead Backend & AI Systems Engineer* — [GitHub](https://github.com/ersin2) • [Website](https://ersin.dev)

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.
