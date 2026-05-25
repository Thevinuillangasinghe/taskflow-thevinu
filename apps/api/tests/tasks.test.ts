import request from "supertest";
import {
  afterAll,
  beforeAll,
  describe,
  expect,
  it,
} from "vitest";

import app from "../src/server";

beforeAll(async () => {
  await app.ready();
});

afterAll(async () => {
  await app.close();
});

describe("Tasks API", () => {
  let token = "";
  let taskId = 0;
  let workspaceId = 0;

  const testUser = {
    name: "Task Test User",
    email: `task${Date.now()}@example.com`,
    password: "password123",
  };

  it("should signup and login a user for task tests", async () => {
    await request(app.server)
      .post("/api/auth/signup")
      .send(testUser);

    const loginResponse = await request(app.server)
      .post("/api/auth/login")
      .send({
        email: testUser.email,
        password: testUser.password,
      });

    expect(loginResponse.status).toBe(200);
    expect(loginResponse.body.token).toBeDefined();
    expect(loginResponse.body.workspace).toBeDefined();

    token = loginResponse.body.token;
    workspaceId = loginResponse.body.workspace.id;
  });

  it("should reject task creation without auth", async () => {
    const response = await request(app.server)
      .post("/api/tasks")
      .send({
        title: "Unauthorized task",
        description: "",
        status: "todo",
        priority: "medium",
        assignee: "Test User",
        workspaceId,
      });

    expect(response.status).toBe(401);
  });

  it("should create a workspace", async () => {
    const response = await request(app.server)
      .post("/api/workspaces")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Test Workspace",
      });

    expect(response.status).toBe(201);
    expect(response.body.workspace).toBeDefined();
  });

  it("should create a task with auth", async () => {
    const response = await request(app.server)
      .post("/api/tasks")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Test task",
        description: "Task created during test",
        status: "todo",
        priority: "medium",
        assignee: "Task Test User",
        workspaceId,
      });

    expect(response.status).toBe(201);
    expect(response.body.task).toBeDefined();

    taskId = response.body.task.id;
  });

  it("should update a task with auth", async () => {
    const response = await request(app.server)
      .patch(`/api/tasks/${taskId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Updated test task",
        status: "in-progress",
        priority: "high",
      });

    expect(response.status).toBe(200);
    expect(response.body.task.title).toBe("Updated test task");
    expect(response.body.task.status).toBe("in-progress");
  });

  it("should get task activity logs", async () => {
    const response = await request(app.server)
      .get(`/api/tasks/${taskId}/activity`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.activityLogs).toBeDefined();
  });

  it("should delete a task with auth", async () => {
    const response = await request(app.server)
      .delete(`/api/tasks/${taskId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Task deleted");
  });
});