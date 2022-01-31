import { CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { FastifyReply, FastifyRequest } from "fastify";
import { PermissionEnum } from "../enums/permission.enum";
import { AuthService } from "../services/auth.service";
import { UserService } from "../services/user.service";

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<FastifyRequest>();
    const response = context.switchToHttp().getResponse<FastifyReply>();

    const accessToken = request.headers.authorization?.split(" ")[1];
    const requiredPermissions = this.reflector.getAllAndOverride<PermissionEnum>("permission", [
      context.getHandler(),
      context.getClass(),
    ]);

    if (accessToken) {
      const loggedInUser = await this.authService.validate(accessToken);

      if (loggedInUser) {
        // Valid access token
        if (loggedInUser.permission < requiredPermissions) {
          throw new ForbiddenException("Du hast keine Berechtigungen für diese Aktion.");
        }

        request.user = loggedInUser;
        return true;
      }

      /*
       * The user has no valid access token. The refresh token is checked
       * and the new access token is returned on a header.
       */
      const refreshToken = request.cookies["Koutetsujou no Kabaneri"];

      if (refreshToken) {
        // Find user of refresh token
        const user = await this.userService.findOne({ where: { refreshToken } });

        if (user) {
          const newAccessToken = this.authService.generateAccessToken(user);
          response.header("X-Access-Token", newAccessToken);
          response.header("Access-Control-Expose-Headers", "X-Access-Token");

          request.user = {
            id: user.id,
            permission: user.permission,
            username: user.username,
          };

          if (user.permission < requiredPermissions) {
            throw new ForbiddenException("Du hast keine Berechtigungen für diese Aktion.");
          }

          return true;
        }
      }

      throw new UnauthorizedException("Deine Daten sind ungültig.");
    }

    throw new UnauthorizedException("Du bist nicht eingeloggt.");
  }
}
