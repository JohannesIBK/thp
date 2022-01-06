import { CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from "@nestjs/common";
import { FastifyRequest } from "fastify";
import { UserService } from "../services/user.service";

@Injectable()
export class ClientAuthGuard implements CanActivate {
  constructor(private readonly userService: UserService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<FastifyRequest>();

    const token = request.headers["authorization"];

    if (!token) {
      throw new ForbiddenException("Du bist nicht eingeloggt");
    }

    const user = await this.userService.findOne({ where: { clientToken: token } });
    if (!user) {
      throw new UnauthorizedException("Dein Token ist ungültig");
    }

    request.user = {
      id: user.id,
      permission: user.permission,
      username: user.username,
    };

    return true;
  }
}
