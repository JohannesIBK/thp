import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Request,
  Response,
  UnauthorizedException,
  UseGuards,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { compare, hash } from "bcrypt";
import { FastifyReply, FastifyRequest } from "fastify";
import { JwtAuthGuard } from "../../auth/auth.guard";
import { UserEntity } from "../../database/user.entity";
import { HasPermission } from "../../decorators/permission.decorator";
import { User } from "../../decorators/user.decorator";
import { ChangePasswordDto } from "../../dto/change-password.dto";
import { CreateUserDto } from "../../dto/create-user.dto";
import { EditUserDto } from "../../dto/edit-user.dto";
import { LoginDto } from "../../dto/login.dto";
import { PermissionEnum } from "../../enums/permission.enum";
import { AuthService } from "../../services/auth.service";
import { UserService } from "../../services/user.service";
import { IJwtUser } from "../../types/jwt-user.interface";

@Controller("user")
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @HasPermission(PermissionEnum.ADMIN)
  async getAllUsers(): Promise<UserEntity[]> {
    return this.userService.find({ select: ["username", "id", "permission"] });
  }

  @Get("token")
  async refreshToken(@Request() request: FastifyRequest, @Response() response: FastifyReply): Promise<void> {
    const refreshToken = request.cookies["Koutetsujou no Kabaneri"];

    if (!refreshToken) {
      throw new UnauthorizedException("Du bist nicht eingeloggt.");
    }

    const user = await this.userService.findOne({ where: { refreshToken } });
    if (!user) {
      response.clearCookie("Koutetsujou no Kabaneri");
      throw new UnauthorizedException("Du bist nicht eingeloggt.");
    }

    const accessToken = this.authService.generateAccessToken(user);

    response.send({ token: accessToken });
  }

  @Put()
  @UseGuards(JwtAuthGuard)
  @HasPermission(PermissionEnum.ADMIN)
  async createUser(@Body() payload: CreateUserDto, @User() user: IJwtUser): Promise<UserEntity> {
    if (payload.permission >= user.permission) {
      throw new ForbiddenException("Du kannst keinen User erstellen, der mehr oder gleichviel Rechte hat.");
    }

    const userWithUsername = await this.userService.findByUsername(payload.username.toLowerCase());
    if (userWithUsername) {
      throw new BadRequestException("Der Username ist bereits vergeben.");
    }

    const password = await hash(payload.password, 12);
    const entity = new UserEntity({ username: payload.username, password, permission: payload.permission });

    return this.userService.save(entity);
  }

  @Patch(":id")
  @UseGuards(JwtAuthGuard)
  @HasPermission(PermissionEnum.ADMIN)
  async editUser(
    @Param("id", new ParseIntPipe()) id: number,
    @Body() payload: EditUserDto,
    @User() user: IJwtUser,
  ): Promise<UserEntity | undefined> {
    if (!payload.permission && !payload.username) {
      throw new BadRequestException("Mindestens eine Sache muss verändert werden");
    }

    if (typeof payload.permission !== "undefined" && user.permission <= payload.permission) {
      throw new ForbiddenException("Du kannst keine Berechtigungen setzen, die über dir sind.");
    }

    const editUser = await this.userService.findById(id);
    if (!editUser) {
      throw new BadRequestException("Der User konnte nicht gefunden werden.");
    }

    if (editUser.permission >= user.permission && user.permission !== PermissionEnum.HEAD) {
      throw new ForbiddenException("Du kannst diesen User nicht bearbeiten.");
    }

    const entity = new UserEntity({ id });

    if (typeof payload.permission !== "undefined") {
      entity.permission = payload.permission;
    }

    if (typeof payload.username !== "undefined") {
      entity.username = payload.username;
    }

    try {
      await this.userService.save(entity);
      return this.userService.findOne({ where: { id }, select: ["username", "permission", "id"] });
    } catch {
      throw new BadRequestException("Der Username ist bereits vergeben.");
    }
  }

  /**
   * Returns the jwt access token and sets the refresh token cookie.
   */
  @Post("login")
  async login(@Body() payload: LoginDto, @Response() response: FastifyReply): Promise<void> {
    const user = await this.userService.findByUsername(payload.username.toLowerCase());

    if (user && (await compare(payload.password, user.password))) {
      const refreshToken = AuthService.generateRefreshToken();
      const accessToken = this.authService.generateAccessToken(user);

      user.refreshToken = refreshToken;
      await this.userService.save(user);

      response.cookie("Koutetsujou no Kabaneri", refreshToken, {
        // signed: true,
        secure: this.configService.get("PRODUCTION"),
        path: "/",
        sameSite: "strict",
        httpOnly: true,
        maxAge: 1000 * 3600 * 24 * 90,
      });

      response.send({
        token: accessToken,
      });
    }

    throw new BadRequestException("Username oder Passwort falsch");
  }

  @Post("change-password")
  @UseGuards(JwtAuthGuard)
  async changePassword(@Body() payload: ChangePasswordDto, @User() jwtUser: IJwtUser): Promise<void> {
    const user = await this.userService.findOne({ where: { id: jwtUser.id } });

    if (!user) throw new BadRequestException("Der User wurde nicht gefunden.");

    const isSamePassword = await compare(payload.old, user.password);

    if (!isSamePassword) {
      throw new BadRequestException("Das Passwort stimmt nicht mit dem alten überein.");
    }

    const password = await hash(payload.new, 12);
    await this.userService.update({ id: jwtUser.id }, { password });
  }

  @Delete("logout")
  @UseGuards(JwtAuthGuard)
  async logout(@Response() response: FastifyReply, @User() user: IJwtUser) {
    if (user?.id) await this.authService.deleteRefreshToken(user.id);
    response.clearCookie("Koutetsujou no Kabaneri", { path: "/" });
    response.status(200).send();
  }

  @Delete(":id")
  @UseGuards(JwtAuthGuard)
  @HasPermission(PermissionEnum.ADMIN)
  async deleteUser(@Param("id", new ParseIntPipe()) id: number, @User() user: IJwtUser): Promise<void> {
    const userEntity = await this.userService.findById(id);

    if (!userEntity) {
      throw new BadRequestException("Der User konnte nicht gefunden werden");
    }

    if (userEntity.permission >= user.permission) {
      throw new ForbiddenException("Du kannst diesen User nicht löschen.");
    }

    await this.userService.delete(id);
  }
}
