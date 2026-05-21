import Fastify from "fastify";
import cors from "@fastify/cors";

const app = Fastify({
  logger: true,
});

app.register(cors, {
  origin: true,
});

app.get("/health", async () => {
  return {
    status: "ok",
    service: "taskflow-api",
  };
});

app.post("/api/auth/signup", async (request, reply) => {
  const body = request.body as {
    name: string;
    email: string;
    password: string;
  };

  const { name, email, password } = body;

  if (!name || !email || !password) {
    return reply.status(400).send({
      error: "All fields are required",
    });
  }

  return {
    message: "User signup successful",
    user: {
      name,
      email,
    },
  };
});

app.post("/api/auth/login", async (request, reply) => {
  const body = request.body as {
    email: string;
    password: string;
  };

  const { email, password } = body;

  if (!email || !password) {
    return reply.status(400).send({
      error: "Email and password are required",
    });
  }

  return {
    message: "Login successful",
    token: "fake-jwt-token",
    user: {
      email,
    },
  };
});

app.listen({ port: 4000 }, (err, address) => {
  if (err) {
    app.log.error(err);
    process.exit(1);
  }

  console.log(`API running at ${address}`);
});