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

app.listen({ port: 4000 }, (err, address) => {
  if (err) {
    app.log.error(err);
    process.exit(1);
  }

  console.log(`API running at ${address}`);
});