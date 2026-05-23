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

describe("Auth API", () => {
  const testUser = {
    name: "Test User",
    email: `test${Date.now()}@example.com`,
    password: "password123",
  };

  it("should reject invalid signup data", async () => {
    const response = await request(app.server)
      .post("/api/auth/signup")
      .send({
        name: "",
        email: "bad-email",
        password: "123",
      });

    expect(response.status).toBe(400);

    expect(response.body.error).toBe(
      "Invalid signup data"
    );
  });

  it("should create a new user", async () => {
    const response = await request(app.server)
      .post("/api/auth/signup")
      .send(testUser);

    expect(response.status).toBe(201);

    expect(response.body.user).toBeDefined();

    expect(response.body.user.email).toBe(
      testUser.email
    );
  });

  it("should login successfully", async () => {
    const response = await request(app.server)
      .post("/api/auth/login")
      .send({
        email: testUser.email,
        password: testUser.password,
      });

    expect(response.status).toBe(200);

    expect(response.body.token).toBeDefined();
  });

  it("should reject invalid login credentials", async () => {
    const response = await request(app.server)
      .post("/api/auth/login")
      .send({
        email: testUser.email,
        password: "wrongpassword",
      });

    expect(response.status).toBe(401);
  });

 it("should reject unauthorized task creation", async () => {
  const response = await request(app.server)
    .post("/api/tasks")
    .send({
      title: "Unauthorized task",
      description: "",
      status: "todo",
      priority: "medium",
      assignee: "Test User",
      workspaceId: 1,
    });

  expect(response.status).toBe(401);
});
});