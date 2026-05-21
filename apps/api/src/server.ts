import Fastify from "fastify";
import cors from "@fastify/cors";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { authenticate } from "./auth";
import prisma from "./prisma";

const app = Fastify({ logger: true });

app.register(cors, {
  origin: "http://localhost:3000",
  methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
});

app.get("/health", async () => {
  return { status: "ok", service: "taskflow-api" };
});

app.post("/api/auth/signup", async (request, reply) => {
  const body = request.body as { name: string; email: string; password: string };
  const { name, email, password } = body;

  if (!name || !email || !password) {
    return reply.status(400).send({ error: "All fields are required" });
  }

  const existingUser = await prisma.user.findUnique({ where: { email } });

  if (existingUser) {
    return reply.status(400).send({ error: "User already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: { name, email, password: hashedPassword },
  });

  return reply.status(201).send({
    message: "Signup successful",
    user: { id: user.id, name: user.name, email: user.email },
  });
});

app.post("/api/auth/login", async (request, reply) => {
  const body = request.body as { email: string; password: string };
  const { email, password } = body;

  if (!email || !password) {
    return reply.status(400).send({ error: "Email and password are required" });
  }

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    return reply.status(401).send({ error: "Invalid credentials" });
  }

  const passwordMatches = await bcrypt.compare(password, user.password);

  if (!passwordMatches) {
    return reply.status(401).send({ error: "Invalid credentials" });
  }

  const token = jwt.sign(
    { userId: user.id, email: user.email },
    process.env.JWT_SECRET as string,
    { expiresIn: "7d" }
  );

  return reply.status(200).send({
    message: "Login successful",
    token,
    user: { id: user.id, name: user.name, email: user.email },
  });
});

app.post("/api/workspaces", async (request, reply) => {
  const body = request.body as { name: string };

  if (!body.name) {
    return reply.status(400).send({ error: "Workspace name is required" });
  }

  const workspace = await prisma.workspace.create({
    data: { name: body.name },
  });

  return reply.status(201).send({
    message: "Workspace created",
    workspace,
  });
});

app.get("/api/workspaces", async () => {
  const workspaces = await prisma.workspace.findMany({
    include: { tasks: true },
  });

  return { workspaces };
});

app.post("/api/tasks", { preHandler: authenticate }, async (request, reply) => {
  const body = request.body as {
    title: string;
    status: string;
    workspaceId: number;
  };

  const { title, status, workspaceId } = body;

  if (!title || !status || !workspaceId) {
    return reply.status(400).send({ error: "All task fields are required" });
  }

  const workspace = await prisma.workspace.findUnique({
    where: { id: workspaceId },
  });

  if (!workspace) {
    return reply.status(404).send({ error: "Workspace not found" });
  }

  const task = await prisma.task.create({
    data: { title, status, workspaceId },
  });

  return reply.status(201).send({
    message: "Task created",
    task,
  });
});

app.get("/api/tasks", async () => {
  const tasks = await prisma.task.findMany({
    include: { workspace: true },
  });

  return { tasks };
});

app.patch("/api/tasks/:id", { preHandler: authenticate }, async (request, reply) => {
  const params = request.params as { id: string };
  const body = request.body as { status: string };
  const taskId = Number(params.id);

  if (!body.status) {
    return reply.status(400).send({ error: "Status is required" });
  }

  const existingTask = await prisma.task.findUnique({
    where: { id: taskId },
  });

  if (!existingTask) {
    return reply.status(404).send({ error: "Task not found" });
  }

  const task = await prisma.task.update({
    where: { id: taskId },
    data: { status: body.status },
  });

  return reply.status(200).send({
    message: "Task updated",
    task,
  });
});

app.delete("/api/tasks/:id", { preHandler: authenticate }, async (request, reply) => {
  const params = request.params as { id: string };
  const taskId = Number(params.id);

  const existingTask = await prisma.task.findUnique({
    where: { id: taskId },
  });

  if (!existingTask) {
    return reply.status(404).send({ error: "Task not found" });
  }

  const deletedTask = await prisma.task.delete({
    where: { id: taskId },
  });

  return reply.status(200).send({
    message: "Task deleted",
    task: deletedTask,
  });
});

app.listen({ port: 4000 }, (err, address) => {
  if (err) {
    app.log.error(err);
    process.exit(1);
  }

  console.log(`API running at ${address}`);
});