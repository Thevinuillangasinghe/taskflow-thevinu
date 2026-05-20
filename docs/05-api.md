# TaskFlow API Contract

This document defines the planned API endpoints for the TaskFlow application.

---

# Authentication APIs

## POST /api/auth/signup

Description:
Create a new user account.

Request Body:
- name
- email
- password

Response:
- User account created successfully
- User information returned

Status Codes:
- 201 Created
- 400 Bad Request

Authentication Required:
No

---

## POST /api/auth/login

Description:
Authenticate user login.

Request Body:
- email
- password

Response:
- Authentication token
- User details

Status Codes:
- 200 OK
- 401 Unauthorized

Authentication Required:
No

---

# Workspace APIs

## POST /api/workspaces

Description:
Create a new workspace.

Request Body:
- workspace name

Response:
- Workspace created successfully

Status Codes:
- 201 Created
- 400 Bad Request

Authentication Required:
Yes

---

## GET /api/workspaces

Description:
Retrieve all workspaces for the authenticated user.

Response:
- List of workspaces

Status Codes:
- 200 OK
- 401 Unauthorized

Authentication Required:
Yes

---

# Task APIs

## POST /api/tasks

Description:
Create a new task.

Request Body:
- title
- description
- priority
- dueDate

Response:
- Task created successfully

Status Codes:
- 201 Created
- 400 Bad Request

Authentication Required:
Yes

---

## GET /api/tasks

Description:
Retrieve all tasks within a workspace.

Response:
- List of tasks

Status Codes:
- 200 OK
- 401 Unauthorized

Authentication Required:
Yes

---

## PUT /api/tasks/:id

Description:
Update an existing task.

Request Body:
- title
- description
- status
- priority

Response:
- Updated task information

Status Codes:
- 200 OK
- 404 Not Found

Authentication Required:
Yes

---

## DELETE /api/tasks/:id

Description:
Delete a task.

Response:
- Task deleted successfully

Status Codes:
- 200 OK
- 404 Not Found

Authentication Required:
Yes

---

# Activity Log APIs

## GET /api/activity/:taskId

Description:
Retrieve activity history for a task.

Response:
- List of activity records

Status Codes:
- 200 OK
- 404 Not Found

Authentication Required:
Yes