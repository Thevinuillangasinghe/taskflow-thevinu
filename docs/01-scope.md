# TaskFlow Scope Document

## Problem Statement

TaskFlow is a lightweight team task management web application designed to help teams organize, assign, and track tasks efficiently using a Kanban-style workflow.

The application allows users to create workspaces, manage tasks, assign responsibilities to teammates, and monitor progress through different task statuses.

---

## In-Scope Features

- User authentication (signup, login, logout)
- Workspace creation and management
- Task creation, editing, assignment, and deletion
- Task statuses (Todo, In Progress, Done)
- Kanban board view
- Activity logging for task changes

---

## Out-of-Scope Features

- Real-time updates using WebSockets
- File attachments
- Email notifications
- Dark mode

---

## Assumptions

- Users have internet access and a modern browser
- PostgreSQL will be used as the database
- The application will be accessed primarily through desktop devices

---

## Constraints

- The project must use the required technology stack
- The timeline for completion is 6 weeks
- Docker must be used for containerization
- GitHub Actions must be used for CI/CD

---

## Success Criteria

- Users can successfully create accounts and log in
- Users can create and manage workspaces
- Users can create, edit, assign, and delete tasks
- Tasks can be moved between statuses on the Kanban board
- The application is deployed publicly and accessible online