# Mentorship Platform - Split Architecture

Three-tier architecture with separate frontend, backend, and managed database.

## Architecture

| Container | Technology | Port |
|-----------|------------|------|
| **Frontend** | React + Vite + Tailwind | 3000 |
| **Backend** | Django REST Framework + JWT | 8000 |
| **Database** | Managed Postgres (Supabase) or localhost container | 5432 |

## Quick Start

```bash
# Using local Postgres container
docker-compose up -d

# Access the app
# Frontend: http://localhost:3000
# Backend API: http://localhost:8000/api/
```

## Using Managed Postgres (Supabase)

Edit `mentorship_platform/.env`:

```env
POSTGRES_HOST=your-project.supabase.co
POSTGRES_DB=postgres
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your-password
```

Then update `docker-compose.yml` to remove the `db` service and `depends_on`.

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/accounts/login/` | POST | JWT login |
| `/api/accounts/register/` | POST | Create account |
| `/api/accounts/profile/` | GET/PATCH | User profile |
| `/api/courses/` | GET | List courses |
| `/api/courses/<slug>/` | GET | Course detail |
| `/api/bookings/` | GET/POST | List/create bookings |
| `/api/dashboards/student/` | GET | Student dashboard |
| `/api/dashboards/mentor/` | GET | Mentor dashboard |

## Development

```bash
# Backend
cd mentorship_platform
pip install -r requirements.txt
python manage.py runserver

# Frontend
cd frontend
npm install
npm run dev
```

## Tech Stack

**Frontend:** React 18, Vite 5, TailwindCSS, React Router, Axios

**Backend:** Django 4.2, Django REST Framework, SimpleJWT, CORS Headers

**Database:** PostgreSQL (managed or containerized)
