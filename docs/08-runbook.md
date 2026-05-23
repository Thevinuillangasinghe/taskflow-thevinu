# TaskFlow Runbook

## Overview

This runbook contains operational instructions for maintaining, deploying, troubleshooting, and recovering the TaskFlow application.

---

# Services

## Frontend

- Platform: Vercel
- Framework: Next.js
- URL:
  https://taskflow-thevinu.vercel.app

## Backend

- Platform: Railway
- Framework: Fastify
- URL:
  https://taskflow-thevinu-production.up.railway.app

## Database

- PostgreSQL hosted on Railway

---

# Local Development

## Start Backend

```bash
cd apps/api
npm run dev