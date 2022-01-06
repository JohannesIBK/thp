import { IJwtUser } from "../jwt-user.interface";

declare module "fastify" {
  interface FastifyRequest {
    user: IJwtUser;
  }
}
