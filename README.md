# TaskFlow

A full-stack Kanban task management application built with Next.js, Fastify, Prisma, and PostgreSQL.

## Live Demo

Frontend:
https://taskflow-thevinu.vercel.app

Backend API:
https://taskflow-thevinu-production.up.railway.app

---

# Features

- User signup and login
- JWT authentication
- Protected routes
- Kanban task board
- Drag and drop tasks
- Create tasks
- Edit tasks
- Delete tasks
- Activity logs
- PostgreSQL database
- Prisma ORM
- Responsive UI
- Production deployment

---

# Tech Stack

## Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS
- dnd-kit

## Backend

- Fastify
- Prisma ORM
- PostgreSQL
- JWT Authentication
- Zod Validation

## Deployment

- Vercel
- Railway

---

# Project Structure

```bash
taskflow-thevinu/
│
├── apps/
│   ├── web/      # Next.js frontend
│   └── api/      # Fastify backend
│
├── prisma/
├── README.md
└── docker-compose.yml
```

---

# Local Development Setup

## 1. Clone Repository

```bash
git clone https://github.com/ThevinuIllangasinghe/taskflow-thevinu.git
```

## 2. Install Dependencies

Frontend:

```bash
cd apps/web
npm install
```

Backend:

```bash
cd apps/api
npm install
```

---

# Environment Variables

## Frontend `.env.local`

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
```

## Backend `.env`

```env
DATABASE_URL=your_postgresql_url
JWT_SECRET=your_secret_key
```

---

# Run Application

## Backend

```bash
cd apps/api
npm run dev
```

## Frontend

```bash
cd apps/web
npm run dev
```

---

# Production Deployment

## Frontend

Deployed using Vercel.

## Backend

Deployed using Railway with PostgreSQL.

---

# API Routes

## Authentication

- POST `/api/auth/signup`
- POST `/api/auth/login`

## Tasks

- GET `/api/tasks`
- POST `/api/tasks`
- PATCH `/api/tasks/:id`
- DELETE `/api/tasks/:id`

## Workspaces

- GET `/api/workspaces`
- POST `/api/workspaces`

---

# Testing

Run backend tests:

```bash
npm run test
```

---

# Screenshots

Add screenshots here after final UI polish.

---

# Author

Thevinu Illangasinghe