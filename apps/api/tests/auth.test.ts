import request from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import app from "../src/server";

beforeAll(async () => {
  await app.ready();
});

afterAll(async () => {
  await app.close();
});

describe("Auth API", () => {
  it("should reject invalid signup data", async () => {
    const response = await request(app.server)
      .post("/api/auth/signup")
      .send({
        name: "",
        email: "bad-email",
        password: "123",
      });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe("Invalid signup data");
  });
});