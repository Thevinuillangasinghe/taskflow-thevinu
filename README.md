# TaskFlow

A full-stack Kanban task management application built with Next.js, Fastify, Prisma, and PostgreSQL.

TaskFlow was developed as part of a Software Development Life Cycle assignment covering requirements, planning, system design, implementation, testing, deployment, and maintenance.

---

## Live Demo

Frontend:  
https://taskflow-thevinu.vercel.app

Backend API:  
https://taskflow-thevinu-production.up.railway.app

---

## Features

- User signup and login
- JWT authentication
- Protected routes
- Workspace support
- Kanban task board
- Drag and drop tasks
- Create tasks
- Edit tasks
- Delete tasks
- Activity logs
- Search and filtering
- Due-date highlighting
- Analytics dashboard
- Calendar page
- Settings page
- Theme toggle
- PostgreSQL database
- Prisma ORM
- Responsive UI
- Docker support
- CI/CD pipeline
- Production deployment

---

## Tech Stack

### Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS
- dnd-kit
- Recharts
- Playwright

### Backend

- Fastify
- Prisma ORM
- PostgreSQL
- JWT Authentication
- Zod Validation
- Vitest
- Supertest

### DevOps & Deployment

- Docker
- Docker Compose
- GitHub Actions
- Vercel
- Railway

---

## Project Structure

```bash
taskflow-thevinu/
│
├── apps/
│   ├── web/              # Next.js frontend
│   └── api/              # Fastify backend
│
├── .github/workflows/   # GitHub Actions CI
├── docs/                # SDLC documentation
├── docker-compose.yml
└── README.md

Local Development Setup
1. Clone Repository
git clone https://github.com/ThevinuIllangasinghe/taskflow-thevinu.git
2. Install Dependencies

Frontend:

cd apps/web
npm install

Backend:

cd apps/api
npm install
Environment Variables
Frontend .env.local
NEXT_PUBLIC_API_URL=http://localhost:4000
Backend .env
DATABASE_URL=your_postgresql_url
JWT_SECRET=your_secret_key
PORT=4000
Run Application Locally
Backend
cd apps/api
npm run dev

Backend runs on:

http://localhost:4000
Frontend
cd apps/web
npm run dev

Frontend runs on:

http://localhost:3000
Run with Docker

From the project root:

docker compose up --build

Services:

Frontend: http://localhost:3000
Backend: http://localhost:4000
PostgreSQL: localhost:5432
Production Deployment
Frontend

Deployed using Vercel and connected to the GitHub repository for automatic deployments.

Backend

Deployed using Railway with PostgreSQL database hosting.

Environment Management

Production environment variables are managed through Vercel and Railway secret stores.

CI/CD

GitHub Actions automatically runs checks on push and pull requests to main.

The workflow includes:

Dependency installation
Linting
Backend tests
Build validation
API Routes
Authentication
POST /api/auth/signup
POST /api/auth/login
Tasks
GET /api/tasks
POST /api/tasks
PATCH /api/tasks/:id
DELETE /api/tasks/:id
GET /api/tasks/:id/activity
Workspaces
GET /api/workspaces
POST /api/workspaces
Health Check
GET /health
Testing
Backend Tests
cd apps/api
npm run test

Backend testing includes:

Auth integration tests
Signup validation tests
Login validation tests
Protected route tests
Task CRUD tests
Activity log tests
Frontend E2E Tests
cd apps/web
npx playwright test

Frontend E2E testing includes:

Signup page flow
Login page flow
Page load validation
Architecture Summary

TaskFlow follows a modern full-stack monorepo architecture.

Frontend: Next.js App Router with Tailwind CSS
Backend: Fastify REST API
Database: PostgreSQL with Prisma ORM
Authentication: JWT-based authentication
Validation: Zod request validation
Testing: Vitest, Supertest, and Playwright
Deployment:
Frontend deployed to Vercel
Backend and database deployed to Railway
CI/CD: GitHub Actions
Containerization: Docker Compose

The application follows a Kanban-style workflow similar to Trello, Linear, and Jira.

Assignment Deliverables Completed
Requirements and planning
System design
Full-stack implementation
Authentication
Workspace and task management
Kanban board
Activity logging
Backend integration testing
Frontend E2E testing
Docker containerization
CI/CD workflow
Production deployment
Documentation and handover preparation
Screenshots

Add screenshots here:

Landing page
Login page
Signup page
Kanban board
Analytics dashboard
Calendar page
Settings page
Future Improvements
Real-time collaboration with WebSockets
File attachments
Email notifications
Team workspace invitations
Backend-powered calendar scheduling
Advanced analytics
Full database-backed user settings
Notification center
Author

Thevinu Illangasinghe