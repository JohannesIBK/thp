import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { randomBytes } from "crypto";
import { UserEntity } from "../database/user.entity";
import { IJwtUser } from "../types/jwt-user.interface";
import { UserService } from "./user.service";

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService, private readonly jwtService: JwtService) {}

  generateAccessToken(user: UserEntity) {
    return this.jwtService.sign({
      username: user.username,
      permission: user.permission,
      id: user.id,
    });
  }

  static generateRefreshToken(): string {
    return randomBytes(32).toString("base64url");
  }

  async validate(token: string): Promise<IJwtUser | null> {
    try {
      return (await this.jwtService.verifyAsync(token)) as IJwtUser;
    } catch {
      return null;
    }
  }

  async deleteRefreshToken(id: number): Promise<void> {
    await this.userService.update(id, { refreshToken: null });
  }
}
