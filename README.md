# Anand Electronics and Steel Furniture — Full-Stack Web Application

Full-stack production platform for **Anand Electronics and Steel Furniture**, featuring a high-performance **React + Vite + TypeScript** frontend and a robust **FastAPI + SQLAlchemy 2.0 ORM** backend.

---

## 🛠️ Technology Stack

### Backend
- **Runtime**: Python 3.12+
- **Environment & Dependency Manager**: Poetry (`pyproject.toml`) & `.venv`
- **Web Framework**: FastAPI (ASGI)
- **Server**: Uvicorn
- **Database**: SQLite (Development) / PostgreSQL (Production ready via SQLAlchemy)
- **Security & Auth**: OAuth2 Password Flow, JWT Tokens (`python-jose`), Passlib (`bcrypt`)
- **Testing**: Pytest & HTTPX TestClient

### Frontend
- **Framework & Tooling**: React 19, Vite 8, TypeScript (~6.0)
- **Routing**: React Router v7
- **Styling**: Vanilla CSS Design System (custom properties, glassmorphism, responsive grid, Outfit / Plus Jakarta Sans fonts)
- **HTTP Client**: Axios with Bearer token interceptor and error normalization
- **Icons**: Lucide React
- **Testing**: Vitest, React Testing Library, jsdom, and jest-dom matchers

---

## 📁 Full-Stack Architecture Pattern

```text
ge_sf-project/
├── backend/
│   └── app/
│       ├── core/            # App configuration, DB engine session, security utilities
│       ├── models/          # SQLAlchemy DB models (User, Category, Product, ServiceRequest, ExchangeRequest)
│       ├── schemas/         # Pydantic v2 validation & serialization schemas
│       ├── repositories/    # Data access layer (Clean CRUD database queries)
│       ├── services/        # Business logic layer (Rules, permissions, file uploads)
│       ├── routes/          # FastAPI APIRouters (HTTP Controllers & Endpoints)
│       ├── static/images/   # Served static media uploads
│       ├── main.py          # FastAPI application entry point & CORS configuration
│       └── seed.py          # Category taxonomy & default admin seed script
├── frontend/
│   └── src/
│       ├── api/             # Axios client, auth interceptors & API modules (auth, categories, products, services, exchanges)
│       ├── components/      # Reusable UI primitives (Navbar, Footer, ImagePlaceholder fallback)
│       ├── pages/           # Application views (Home, Catalog, ProductDetail, ServiceRequest, Exchange, AdminLogin, AdminDashboard)
│       ├── tests/           # Vitest & React Testing Library test suites (5 suites, 9 tests)
│       ├── types/           # TypeScript domain models matching backend Pydantic schemas
│       ├── App.tsx          # Client-side router configuration
│       ├── index.css        # Vanilla CSS Design System with theme custom properties
│       └── main.tsx         # React application bootstrap
├── tests/                   # Backend pytest suite (5/5 tests passing)
└── pyproject.toml           # Poetry backend dependency manifest
```

---

## 🚀 Quick Start Guide

### 1. Backend Setup & Run

**Windows PowerShell:**
```powershell
# 1. Activate Virtual Environment
. .\.venv\Scripts\activate

# 2. Install dependencies
poetry install

# 3. Seed Database & Create Admin User (admin@gesf.com / admin123)
$env:PYTHONPATH="backend"; python backend/app/seed.py

# 4. Start FastAPI server
$env:PYTHONPATH="backend"; python -m uvicorn app.main:app --reload
```

**Linux / macOS / Git Bash:**
```bash
source .venv/bin/activate
poetry install
PYTHONPATH=backend python backend/app/seed.py
PYTHONPATH=backend uvicorn app.main:app --reload
```
API runs at: `http://127.0.0.1:8000` (Docs: `http://127.0.0.1:8000/docs`).

---

### 2. Frontend Setup & Run

Open a new terminal window:

```bash
cd frontend

# Install dependencies
npm install

# Start Vite dev server (with automatic /api proxy to http://127.0.0.1:8000)
npm run dev
```
Frontend runs at: `http://localhost:5173`.

> **Admin Portal Credentials**:
> - **URL**: `http://localhost:5173/admin/login`
> - **Email**: `admin@gesf.com`
> - **Password**: `admin123`

---

## 🧪 Running Tests

### Backend Test Suite (Pytest)
```powershell
# PowerShell
$env:PYTHONPATH="backend"; .\.venv\Scripts\python.exe -m pytest

# Bash / Linux
PYTHONPATH=backend pytest
```

### Frontend Test Suite (Vitest)
```bash
cd frontend
npm test
```

### Frontend Production Build Check
```bash
cd frontend
npm run build
```

---

## 🔑 Main API Endpoints Summary

| Method | Endpoint | Auth Required | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/health` | No | System health check |
| `POST` | `/api/v1/auth/login` | No | Admin login & JWT token return |
| `GET` | `/api/v1/auth/me` | Yes | Get current user info |
| `GET` | `/api/v1/categories` | No | List all categories & subcategories |
| `GET` | `/api/v1/products` | No | List/filter catalog products |
| `GET` | `/api/v1/products/{id_or_slug}` | No | Get product details & image gallery |
| `POST` | `/api/v1/products` | Yes (Admin) | Create catalog product |
| `POST` | `/api/v1/products/{id}/images` | Yes (Admin) | Upload product image |
| `POST` | `/api/v1/services/request` | No | Customer repair service booking |
| `GET` | `/api/v1/services/requests` | Yes (Admin) | View customer repair requests |
| `POST` | `/api/v1/exchanges/request` | No | Customer furniture exchange submission |
| `GET` | `/api/v1/exchanges/requests` | Yes (Admin) | View furniture exchange requests |