import { FastifyReply, FastifyRequest } from "fastify";
import jwt from "jsonwebtoken";

export async function authenticate(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const authHeader =
    request.headers.authorization;

  if (!authHeader) {
    return reply.status(401).send({
      error: "Unauthorized",
    });
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return reply.status(401).send({
      error: "Invalid token",
    });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    );

    request.user = decoded;
  } catch (error) {
    return reply.status(401).send({
      error: "Token verification failed",
    });
  }
}