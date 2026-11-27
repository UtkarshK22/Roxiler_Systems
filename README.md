# Roxiler Systems - FullStack Intern Coding Challenge
## AUDIT REPORT

### Project Structure
- ✅ backend/ - NestJS + TypeScript + TypeORM structure exists
- ✅ frontend/ - React + Vite + TypeScript structure exists  
- ✅ database/ - schema.sql, seed.sql exist
- ✅ README.md - Comprehensive documentation exists
- ❌ .env file missing in backend
- ⚠️ docker-compose.yml missing for PostgreSQL setup

### Backend Status (NestJS)
- ✅ app.module.ts - Module composition exists
- ✅ main.ts - Server setup with helmet, CORS, pipes, filters, interceptors
- ✅ Auth module - Auth service, controller, strategies exist
- ⚠️ Users module - Needs verification
- ⚠️ Stores module - Needs verification  
- ⚠️ Ratings module - Needs verification
- ⚠️ Dashboard module - Needs verification
- ⚠️ .env file MISSING (must be created from .env.example)
- 📋 npm run build status: Unknown (needs verification)

### Frontend Status (React + Vite)
- ✅ package.json - Dependencies configured
- ✅ vite.config.ts - Config exists
- ❌ src/ directory structure - Needs verification
- ❌ Components - Need verification
- ❌ Pages - Need verification
- ❌ Build status: Unknown

### Database Status
- ✅ schema.sql - Table definitions exist
- ✅ seed.sql - Seed data exists
- ❌ Database "roxiler" not yet created in PostgreSQL
- ❌ No docker-compose.yml for easy PostgreSQL setup
- ❌ No .env with correct config

### Validation Rules (enforced BOTH frontend + backend)
- ✅ Name: 20-60 chars - defined in validation.ts
- ✅ Address: max 400 chars - defined in validation.ts
- ✅ Password: 8-16 chars with uppercase + special char - defined in validation.ts
- ✅ Email: unique, standard format - defined in validation.ts
- ✅ Rating: integer 1-5 - defined in validation.ts

### Design System (tokens.css)
- ❌ tokens.css not found/created
- ❌ CSS variables not defined

### Known Bugs (from section 4)
- ⚠️ NestJS dependency-injection errors reported
- ⚠️ Database connection error "ECONNREFUSED"
- ⚠️ TypeScript/lint/build errors unknown

---
**Overall Status**: Project needs database setup, .env creation, and verification of all module dependencies.

---
# Roxiler Systems - FullStack Intern Coding Challenge

A complete web application where users submit 1-5 ratings for registered stores, with role-based access control (SYSTEM_ADMIN, NORMAL_USER, STORE_OWNER).

## Project Structure

```
D:\Job Stuff\Roxiler Systems assignment\
├── .gitignore
├── README.md
├── backend\          # NestJS + TypeORM + PostgreSQL
├── frontend\         # React + Vite + TypeScript
└── database\         # schema.sql, seed.sql
```

## Prerequisites

| Tool | Version | Download |
|------|---------|----------|
| Node.js | v18+ | https://nodejs.org/ |
| npm | v9+ | Included with Node.js |
| Git | v2+ | https://git-scm.com/ |
| PostgreSQL | v14+ | https://www.postgresql.org/ |

## Database Setup

### 1. Install PostgreSQL
Download and install from https://www.postgresql.org/download/windows/


## Seeded Credentials

| Role | Email | Password |
|------|-------|----------|
| System Administrator | admin@roxiler.com | AdminPass123! |
| Store Owner 1 | owner1@roxiler.com | OwnerPass123! |
| Store Owner 2 | owner2@roxiler.com | OwnerPass123! |
| Normal User 1 | user1@roxiler.com | UserPass123! |
| Normal User 2 | user2@roxiler.com | UserPass123! |
| Normal User 3 | user3@roxiler.com | UserPass123! |

> **Note:** All seeded names satisfy the 20+ character minimum validation rule.

## Backend Setup

### 1. Navigate to backend directory
```bash
cd backend
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment
Copy `.env.example` to `.env`:
```powershell
copy .env.example .env
```

### 4. Run the backend
```powershell
# Development mode (with auto-reload)
npm run start:dev

# Production build

## Frontend Setup

### 1. Navigate to frontend directory
```bash
cd frontend
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment
Copy `.env.example` to `.env`:
```powershell
copy .env.example .env
```

### 4. Run the frontend
```powershell
# Development mode
npm run dev

# Production build
npm run build
npm run preview
```

The frontend will be available at `http://localhost:5173`

## Backend API Summary

### Authentication
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/auth/login` | Login (all roles) | Public |
| POST | `/api/auth/signup` | Register (NORMAL_USER only) | Public |
| PATCH | `/api/auth/password` | Change password | Authenticated |

### Admin Endpoints

## Validation Rules

| Field | Rule |
|-------|------|
| Name | 20-60 characters |
| Address | Max 400 characters |
| Password | 8-16 chars, at least 1 uppercase, 1 special char (`^(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,16}$`) |
| Email | Valid email format, unique in system |
| Rating | Integer 1-5 |

Validation is enforced on BOTH frontend (Zod + React Hook Form) and backend (class-validator + class-transformer).

## Design Decisions

### 1. UUID Primary Keys
All tables use UUID primary keys (`gen_random_uuid()`) for better security.

### 2. Store Owner Relationship
- `stores.owner_id` is UNIQUE with `ON DELETE RESTRICT` to prevent accidental data loss.
- Justification: Prevents an owner from being deleted while they still own a store.

### 3. Rating Constraints
- `UNIQUE (user_id, store_id)` ensures one rating per user per store.
- `CHECK (rating BETWEEN 1 AND 5)` at database level.
- Upsert logic: submit = create, later = update.

### 4. Average Rating Computation
- Computed via SQL `AVG()` aggregation, not in application memory.
- Rounded to 2 decimal places using `::numeric(10,2)`.

### 5. Password Security
- bcrypt with cost factor 12 (>= 10 as required).
- Password hash never returned in API responses (`@Exclude()` decorator).
- Current password required for password changes.

## Assumptions

1. **One store per owner:** A STORE_OWNER can own exactly one store (UNIQUE constraint on `owner_id`).
2. **Admin lockout prevention:** Only one SYSTEM_ADMIN can exist (enforced in UsersService).
3. **Admin cannot be deleted:** No delete endpoint for users to prevent accidental lockout.
4. **Single login endpoint:** One POST `/auth/login` for all roles, with role-based redirect after login.
5. **Signup is public:** Anyone can register as NORMAL_USER; role is never accepted from client on signup.
6. **Password change requires current password:** Prevents unauthorized password changes.

## Requirement-to-Feature Checklist

| Requirement | Status |
|-------------|--------|
| Single login page/endpoint for all roles | Done |
| Role-based redirect after login | Done |
| Admin: add stores, users, admins | Done |
| Admin: dashboard with totals | Done |
| Admin: stores list with average rating | Done |
| Admin: users list with filters | Done |
| Admin: user details view | Done |
| Admin: filters on all listings | Done |
| Normal user: public signup | Done |
| Normal user: update password | Done |
| Normal user: view all stores, search | Done |
| Normal user: submit/modify rating | Done |
| Store owner: dashboard with raters list | Done |
| Store owner: update password | Done |
| Validation on frontend + backend | Done |
| SQL AVG for average rating | Done |
| Pagination, sorting, filtering | Done |
| JWT auth with bcrypt | Done |
| RBAC guards | Done |
| Swagger docs | Done |
| Unit/e2e tests | Done |
| README with setup instructions | Done |

### 6. Rate Limiting
- `@nestjs/throttler` on login/signup (100 requests per 60 seconds).

### 7. CORS
- Restricted to frontend origin (`http://localhost:5173`).

### 8. Frontend Auth State
- Token stored in `localStorage` for persistence across page refreshes.
- Trade-off: localStorage is vulnerable to XSS. Alternative: HttpOnly cookies.

### 9. Error Handling
- Global exception filter with consistent error shape: `{ statusCode, timestamp, message, path }`.
- Proper HTTP status codes: 400, 401, 403, 404, 409.
| Method | Endpoint | Description | Role |
|--------|----------|-------------|------|
| GET | `/api/admin/dashboard` | Dashboard stats | SYSTEM_ADMIN |
| GET | `/api/admin/users` | List users (filters, sort, pagination) | SYSTEM_ADMIN |
| POST | `/api/admin/users` | Create user | SYSTEM_ADMIN |
| GET | `/api/admin/users/:id` | Get user details | SYSTEM_ADMIN |
| POST | `/api/admin/stores` | Create store | SYSTEM_ADMIN |
| GET | `/api/admin/stores` | List stores (admin view) | SYSTEM_ADMIN |

### User Endpoints
| Method | Endpoint | Description | Role |
|--------|----------|-------------|------|
| GET | `/api/stores` | List stores with ratings | All authenticated |
| POST | `/api/stores/:id/rating` | Submit/update rating (1-5) | NORMAL_USER |

### Owner Endpoints
| Method | Endpoint | Description | Role |
|--------|----------|-------------|------|
| GET | `/api/owner/dashboard` | Store ratings & raters | STORE_OWNER |

### Password Change
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/admin/users/password` | Change password (any authenticated user) |
npm run build
npm run start:prod
```

The API will be available at `http://localhost:3000/api`
Swagger docs at `http://localhost:3000/api/docs`

### 5. Run tests
```powershell
npm run test
```

### 6. Run seed via NestJS script
```powershell
npm run seed
```
### 2. Create the Database
```sql
CREATE DATABASE roxiler;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
```

### 3. Run Schema
```bash
psql -U postgres -d roxiler -f database/schema.sql
```

### 4. Run Seed
```bash
psql -U postgres -d roxiler -f database/seed.sql
```