# TaskFlow API Contract

This document defines the planned REST API endpoints for the TaskFlow application.

---

## Authentication

### POST /api/auth/signup
Creates a new user account.

Request:
- name
- email
- password

Response:
- id
- name
- email

Status Codes:
- 201 Created
- 400 Bad Request

Auth Required:
No

---

### POST /api/auth/login
Logs in an existing user.

Request:
- email
- password

Response:
- token
- user

Status Codes:
- 200 OK
- 401 Unauthorized

Auth Required:
No

---

### POST /api/auth/logout
Logs out the current user.

Request:
- none

Response:
- message

Status Codes:
- 200 OK

Auth Required:
Yes

---

### GET /api/me
Returns the currently logged-in user.

Request:
- none

Response:
- id
- name
- email

Status Codes:
- 200 OK
- 401 Unauthorized

Auth Required:
Yes

---

## Workspaces

### POST /api/workspaces
Creates a workspace.

Request:
- name

Response:
- id
- name
- ownerId

Status Codes:
- 201 Created
- 400 Bad Request
- 401 Unauthorized

Auth Required:
Yes

---

### GET /api/workspaces
Gets all workspaces for the logged-in user.

Request:
- none

Response:
- list of workspaces

Status Codes:
- 200 OK
- 401 Unauthorized

Auth Required:
Yes

---

### GET /api/workspaces/:id
Gets a single workspace.

Request:
- workspace id

Response:
- id
- name
- ownerId

Status Codes:
- 200 OK
- 404 Not Found

Auth Required:
Yes

---

### DELETE /api/workspaces/:id
Deletes a workspace.

Request:
- workspace id

Response:
- message

Status Codes:
- 200 OK
- 404 Not Found

Auth Required:
Yes

---

## Tasks

### POST /api/tasks
Creates a task.

Request:
- title
- description
- status
- priority
- assigneeId
- dueDate
- workspaceId

Response:
- created task

Status Codes:
- 201 Created
- 400 Bad Request
- 401 Unauthorized

Auth Required:
Yes

---

### GET /api/workspaces/:workspaceId/tasks
Gets all tasks in a workspace.

Request:
- workspaceId

Response:
- list of tasks

Status Codes:
- 200 OK
- 401 Unauthorized
- 404 Not Found

Auth Required:
Yes

---

### PATCH /api/tasks/:id
Updates a task.

Request:
- title
- description
- status
- priority
- assigneeId
- dueDate

Response:
- updated task

Status Codes:
- 200 OK
- 400 Bad Request
- 404 Not Found

Auth Required:
Yes

---

### DELETE /api/tasks/:id
Deletes a task.

Request:
- task id

Response:
- message

Status Codes:
- 200 OK
- 404 Not Found

Auth Required:
Yes

---

## Activity Log

### GET /api/tasks/:id/activity
Gets the activity history for a task.

Request:
- task id

Response:
- list of activity logs

Status Codes:
- 200 OK
- 404 Not Found

Auth Required:
Yes

---

## Invitations

### POST /api/workspaces/:id/invite
Invites a teammate to a workspace.

Request:
- email

Response:
- invitation sent message

Status Codes:
- 200 OK
- 400 Bad Request
- 404 Not Found

Auth Required:
Yes