import { z } from "zod";
import Fastify from "fastify";
import cors from "@fastify/cors";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { authenticate } from "./auth";
import prisma from "./prisma";

const app = Fastify({ logger: true });

type AuthUser = {
  userId: number;
  email: string;
};

const signupSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Valid email is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const loginSchema = z.object({
  email: z.string().email("Valid email is required"),
  password: z.string().min(1, "Password is required"),
});

const workspaceSchema = z.object({
  name: z.string().min(1, "Workspace name is required"),
});

const createTaskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  status: z.string().min(1, "Status is required"),
  priority: z.string().optional(),
  assignee: z.string().optional(),
  dueDate: z.string().optional(),
  workspaceId: z.number(),
});

const updateTaskSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  status: z.string().optional(),
  priority: z.string().optional(),
  assignee: z.string().optional(),
  dueDate: z.string().optional(),
});

app.register(cors, {
  origin: true,
  methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
});

app.get("/health", async () => {
  return { status: "ok", service: "taskflow-api" };
});

app.post("/api/auth/signup", async (request, reply) => {
  const result = signupSchema.safeParse(request.body);

  if (!result.success) {
    return reply.status(400).send({
      error: "Invalid signup data",
      details: result.error.flatten(),
    });
  }

  const { name, email, password } = result.data;

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    return reply.status(400).send({
      error: "User already exists",
    });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });

  const workspace = await prisma.workspace.create({
    data: {
      name: `${email}-workspace`,
    },
  });

  return reply.status(201).send({
    message: "Signup successful",
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
    workspace,
  });
});

app.post("/api/auth/login", async (request, reply) => {
  const result = loginSchema.safeParse(request.body);

  if (!result.success) {
    return reply.status(400).send({
      error: "Invalid login data",
      details: result.error.flatten(),
    });
  }

  const { email, password } = result.data;

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    return reply.status(401).send({
      error: "Invalid credentials",
    });
  }

  const passwordMatches = await bcrypt.compare(password, user.password);

  if (!passwordMatches) {
    return reply.status(401).send({
      error: "Invalid credentials",
    });
  }

  let workspace = await prisma.workspace.findFirst({
    where: {
      name: `${user.email}-workspace`,
    },
  });

  if (!workspace) {
    workspace = await prisma.workspace.create({
      data: {
        name: `${user.email}-workspace`,
      },
    });
  }

  const token = jwt.sign(
    {
      userId: user.id,
      email: user.email,
    },
    process.env.JWT_SECRET as string,
    {
      expiresIn: "7d",
    }
  );

  return reply.status(200).send({
    message: "Login successful",
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
    workspace,
  });
});

app.post(
  "/api/workspaces",
  { preHandler: authenticate },
  async (request, reply) => {
    const result = workspaceSchema.safeParse(request.body);

    if (!result.success) {
      return reply.status(400).send({
        error: "Invalid workspace data",
        details: result.error.flatten(),
      });
    }

    const { name } = result.data;
    const user = request.user as AuthUser;

    const workspace = await prisma.workspace.create({
      data: {
        name: `${user.email}-${name}`,
      },
    });

    return reply.status(201).send({
      message: "Workspace created",
      workspace,
    });
  }
);

app.get(
  "/api/workspaces",
  { preHandler: authenticate },
  async (request) => {
    const user = request.user as AuthUser;

    const workspaces = await prisma.workspace.findMany({
      where: {
        name: {
          startsWith: user.email,
        },
      },
      include: {
        tasks: true,
      },
    });

    return { workspaces };
  }
);

app.post(
  "/api/tasks",
  { preHandler: authenticate },
  async (request, reply) => {
    const result = createTaskSchema.safeParse(request.body);

    if (!result.success) {
      return reply.status(400).send({
        error: "Invalid task data",
        details: result.error.flatten(),
      });
    }

    const {
      title,
      description,
      status,
      priority,
      assignee,
      dueDate,
      workspaceId,
    } = result.data;

    const user = request.user as AuthUser;

    const workspace = await prisma.workspace.findFirst({
      where: {
        id: workspaceId,
        name: {
          startsWith: user.email,
        },
      },
    });

    if (!workspace) {
      return reply.status(403).send({
        error: "You do not have access to this workspace",
      });
    }

    const task = await prisma.task.create({
      data: {
        title,
        description,
        status,
        priority: priority || "medium",
        assignee,
        dueDate: dueDate ? new Date(dueDate) : null,
        workspaceId: workspace.id,
        activityLogs: {
          create: {
            action: `Task created with status ${status}`,
          },
        },
      },
      include: {
        activityLogs: true,
        workspace: true,
      },
    });

    return reply.status(201).send({
      message: "Task created",
      task,
    });
  }
);

app.get(
  "/api/tasks",
  { preHandler: authenticate },
  async (request) => {
    const user = request.user as AuthUser;

    const workspaces = await prisma.workspace.findMany({
      where: {
        name: {
          startsWith: user.email,
        },
      },
    });

    const workspaceIds = workspaces.map((workspace) => workspace.id);

    const tasks = await prisma.task.findMany({
      where: {
        workspaceId: {
          in: workspaceIds,
        },
      },
      include: {
        workspace: true,
        activityLogs: true,
      },
    });

    return { tasks };
  }
);

app.patch(
  "/api/tasks/:id",
  { preHandler: authenticate },
  async (request, reply) => {
    const params = request.params as {
      id: string;
    };

    const taskId = Number(params.id);
    const user = request.user as AuthUser;

    const result = updateTaskSchema.safeParse(request.body);

    if (!result.success) {
      return reply.status(400).send({
        error: "Invalid update data",
        details: result.error.flatten(),
      });
    }

    const body = result.data;

    const existingTask = await prisma.task.findFirst({
      where: {
        id: taskId,
        workspace: {
          name: {
            startsWith: user.email,
          },
        },
      },
    });

    if (!existingTask) {
      return reply.status(404).send({
        error: "Task not found",
      });
    }

    const task = await prisma.task.update({
      where: { id: taskId },
      data: {
        title: body.title,
        description: body.description,
        status: body.status,
        priority: body.priority,
        assignee: body.assignee,
        dueDate: body.dueDate ? new Date(body.dueDate) : undefined,
        activityLogs: {
          create: {
            action: "Task updated",
          },
        },
      },
      include: {
        activityLogs: true,
        workspace: true,
      },
    });

    return reply.status(200).send({
      message: "Task updated",
      task,
    });
  }
);

app.get(
  "/api/tasks/:id/activity",
  { preHandler: authenticate },
  async (request, reply) => {
    const params = request.params as {
      id: string;
    };

    const taskId = Number(params.id);
    const user = request.user as AuthUser;

    const task = await prisma.task.findFirst({
      where: {
        id: taskId,
        workspace: {
          name: {
            startsWith: user.email,
          },
        },
      },
    });

    if (!task) {
      return reply.status(404).send({
        error: "Task not found",
      });
    }

    const activityLogs = await prisma.activityLog.findMany({
      where: { taskId },
      orderBy: {
        createdAt: "desc",
      },
    });

    return { activityLogs };
  }
);

app.delete(
  "/api/tasks/:id",
  { preHandler: authenticate },
  async (request, reply) => {
    const params = request.params as {
      id: string;
    };

    const taskId = Number(params.id);
    const user = request.user as AuthUser;

    const existingTask = await prisma.task.findFirst({
      where: {
        id: taskId,
        workspace: {
          name: {
            startsWith: user.email,
          },
        },
      },
    });

    if (!existingTask) {
      return reply.status(404).send({
        error: "Task not found",
      });
    }

    await prisma.activityLog.deleteMany({
      where: { taskId },
    });

    const deletedTask = await prisma.task.delete({
      where: { id: taskId },
    });

    return reply.status(200).send({
      message: "Task deleted",
      task: deletedTask,
    });
  }
);

const port = Number(process.env.PORT) || 4000;

if (process.env.NODE_ENV !== "test") {
  app.listen(
    {
      port,
      host: "0.0.0.0",
    },
    (err, address) => {
      if (err) {
        app.log.error(err);
        process.exit(1);
      }

      console.log(`API running at ${address}`);
    }
  );
}

export default app;