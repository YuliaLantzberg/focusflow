# FocusFlow

FocusFlow is a full-stack project and task management application built as a portfolio-quality SaaS system.

It is designed to demonstrate real-world backend architecture, frontend structure, and product-level decision making - including data consistency, workflow rules, and backend-enforced state.

The application allows users to manage projects and tasks using Kanban-style workflows, explicit project lifecycle states, and a scalable foundation for analytics and AI-driven features.

**Quick Overview**
- Full-stack SaaS-style project (Next.js + NestJS)
- Backend-driven workflow logic (ordering, lifecycle rules)
- Built as a real-world portfolio project, not a tutorial clone

## Tech Stack

**Backend**
- Node.js / NestJS
- PostgreSQL
- Prisma ORM
- JWT Authentication
- bcrypt (password hashing)

**Frontend**
- Next.js (App Router)
- TypeScript
- Tailwind CSS
- dnd-kit (Kanban drag & drop)

## Core Features (Implemented)

**Authentication**
- User signup & login
- JWT-based authentication
- Protected backend routes
- Frontend auth flows: Login, Signup, Forgot Password UI
- Separate layouts for: Public pages / Auth pages / Logged-in app

**Projects**
- Create, view, and manage projects
- Project lifecycle statuses: Planning, Active, On Hold, Completed, Archived
- Soft deletion (projects are hidden, not removed)
- Project details page with structured layout

**Tasks (Kanban Board)**
- Tasks belong inside projects (no global tasks view)
- Kanban board with columns by task status
- Drag & drop task movement
- Stable, deterministic ordering:
  - Explicit `order` field per task (UI never relies on array index)
  - Backend-controlled ordering:
    - Frontend sends intent (status, requestedOrder)
    - Backend validates and computes finalOrder
    - Automatic renormalization when ordering degrades
- Supports:
  - Reordering within column
  - Moving across columns
  - Empty-column drops
  - End-of-column drops

**Notes**
- Backend complete: create, list, update, soft delete
- Notes UI planned

## Architecture Highlights

**Backend authority**
- Backend is the single source of truth
- Frontend never persists reordered arrays
- Task ordering and validation happen server-side
- Renormalization uses transactions for consistency

**Explicit ordering strategy**
- Sparse ordering (1000, 2000, 3000…)
- Safe inserts between items
- Automatic cleanup when gaps shrink or collisions occur

**Time rules (Dashboard)**

- now is evaluated once per request using server time
- A task or project is overdue if dueDate < now
- A task or project is due soon if now <= dueDate <= now + 7 days
- Tasks without dueDate are excluded from due-based tiers

## Frontend Route Structure (Current)
app/
layout.tsx // root layout
(landing)/ // public pages
(auth)/ // login, signup, forgot-password
(app)/ // authenticated app
layout.tsx // sidebar + topbar shell
dashboard/
projects/
tasks/
analytics/


## UI System (Implemented)
- Reusable layouts: Sidebar, Topbar, PageContainer, PageSection
- UI primitives: Badge, ListItem, PageTitle, CreateButton, FormCard, FormField, AuthCard, AuthInput
- Dark theme across the app with consistent spacing and structure

## Current Project Status

**Completed**
- Backend APIs (Projects, Tasks, Notes)
- Authentication (JWT)
- Database & migrations
- Kanban drag & drop + backend renormalization
- Frontend layout & navigation
- Projects UI
- Auth UI + Landing page
- Project status semantics enforcement

**In Progress / Planned**
- Dashboard UX & data
- Notes UI
- Client UI
- Task details page
- Enhanced project & task forms
- Analytics (time, cost, profit)
- AI features (task generation, focus suggestions)
- Production auth hardening (cookies, middleware)
- Deployment & demo mode

## Why This Project Exists
FocusFlow is intentionally built to show:
- Clean backend architecture
- Real-world data consistency problems and solutions
- Thoughtful product decisions (not just UI)
- Scalable structure for future analytics and AI

## Roadmap (Next)
- Server-side auth (cookies) + route protection via middleware
- Analytics dashboards (initial metrics)
- AI-assisted task planning (MVP)
- Enhanced dashboard UX
- Deployment with a demo account
- Full documentation + short demo video

## Changelog (Recent)
- Kanban drag & drop with backend-controlled ordering + automatic renormalization
- Project lifecycle statuses + UI structure for projects area
- JWT authentication flows + protected backend routes
- Notes API (CRUD + soft delete)
