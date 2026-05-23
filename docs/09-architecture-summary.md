# TaskFlow Architecture Summary

## Overview

TaskFlow is a full-stack Kanban task management platform built using a modern monorepo architecture.

The system consists of:

- Next.js frontend
- Fastify backend API
- PostgreSQL database
- Prisma ORM
- JWT authentication
- Docker containerization
- GitHub Actions CI/CD pipeline

---

# High-Level Architecture

```text
Frontend (Next.js)
        │
        ▼
Backend API (Fastify)
        │
        ▼
PostgreSQL Database

The backend handles:

authentication
validation
business logic
database access

The database stores:

users
workspaces
tasks
activity logs
Frontend Architecture
Framework
Next.js App Router
React
TypeScript
Tailwind CSS
Major Pages
Login
Signup
Board
Analytics
Calendar
Settings
UI Features
Drag and drop Kanban board
Search and filtering
Toast notifications
Theme toggle
Responsive design
Analytics charts
Backend Architecture
Framework
Fastify
TypeScript
Responsibilities
JWT authentication
Request validation
CRUD operations
Activity logging
Workspace management
Error handling
Validation

Zod is used for schema validation.

Database Architecture
Database
PostgreSQL
ORM
Prisma ORM
Main Entities
Users

Stores:

account details
credentials
Workspaces

Stores:

workspace information
Tasks

Stores:

title
description
priority
status
due dates
Activity Logs

Stores:

task actions
timestamps
Authentication Flow
User signs up
Password is hashed
User logs in
JWT token is generated
Frontend stores token
Protected routes require JWT
Testing Architecture
Backend Testing
Vitest
Supertest

Tests include:

auth tests
CRUD tests
validation tests
protected route tests
Frontend Testing
Playwright E2E testing

Tests include:

signup flow
login flow
page loading
DevOps Architecture
CI/CD

GitHub Actions pipeline:

install dependencies
lint
test
build
Containerization

Docker Compose manages:

frontend
backend
database
Deployment Architecture
Frontend

Hosted on Vercel.

Backend

Hosted on Railway.

Database

PostgreSQL hosted on Railway.

Design Decisions
Why Next.js
fast frontend development
routing support
deployment simplicity
Why Fastify
high performance
TypeScript support
lightweight API framework
Why Prisma
type-safe database access
simplified migrations
developer productivity
Why PostgreSQL
reliability
relational consistency
production-ready support
Future Improvements
WebSocket real-time collaboration
File uploads
Email notifications
Team invitations
Advanced analytics
Full user preference persistence