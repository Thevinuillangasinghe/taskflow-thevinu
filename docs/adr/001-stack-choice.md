# ADR-001 — Technology Stack Selection

## Status

Accepted

---

## Context

TaskFlow is a lightweight team task management application that requires a modern, scalable, and maintainable technology stack suitable for full-stack web development.

The application requires:
- A responsive frontend
- A backend API
- A relational database
- Authentication support
- Docker compatibility
- CI/CD support
- Strong TypeScript integration

---

## Decision

The following technology stack was selected:

### Frontend
- Next.js
- TypeScript
- Tailwind CSS

### Backend
- Fastify
- Prisma ORM

### Database
- PostgreSQL

### DevOps & Deployment
- Docker
- GitHub Actions
- Vercel
- Railway

---

## Rationale

### Next.js
Next.js was selected because it is a modern React framework with strong performance, routing, and TypeScript support. It is widely used in industry and matches the assignment requirements.

### Fastify
Fastify was selected for the backend because it is lightweight, fast, and well-suited for building APIs with Node.js and TypeScript.

### PostgreSQL
PostgreSQL was selected because it is a reliable and scalable relational database system commonly used in production applications.

### Prisma ORM
Prisma provides type-safe database access and simplifies database management and migrations.

### Tailwind CSS
Tailwind CSS allows rapid and consistent frontend styling using utility classes.

### Docker
Docker enables consistent development and deployment environments across systems.

### GitHub Actions
GitHub Actions provides automated CI/CD workflows for testing and deployment.

### Vercel and Railway
Vercel is suitable for frontend hosting while Railway provides simple backend and PostgreSQL hosting.

---

## Consequences

### Positive
- Strong TypeScript support
- Modern industry-standard stack
- Scalable architecture
- Easy deployment workflow
- Good developer experience

### Negative
- Learning curve for multiple technologies
- Additional setup complexity for Docker and CI/CD