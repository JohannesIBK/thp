import { BadRequestException, Body, Controller, Post, Response, UseGuards } from "@nestjs/common";
import { compare } from "bcrypt";
import { randomBytes } from "crypto";
import { FastifyReply } from "fastify";
import { ClientAuthGuard } from "../../auth/client-auth.guard";
import { StatsEntity } from "../../database/stats.entity";
import { User } from "../../decorators/user.decorator";
import { AddKillDto } from "../../dto/add-kill.dto";
import { AddWinDto } from "../../dto/add-win.dto";
import { PermissionEnum } from "../../enums/permission.enum";
import { PlayerService } from "../../services/player.service";
import { SocketService } from "../../services/socket.service";
import { StatsService } from "../../services/stats.service";
import { UserService } from "../../services/user.service";
import { IJwtUser } from "../../types/jwt-user.interface";

@Controller("client")
export class ClientController {
  constructor(
    private readonly userService: UserService,
    private readonly statsService: StatsService,
    private readonly playerService: PlayerService,
    private readonly socketService: SocketService,
  ) {}

  @Post("login")
  async login(@Body() payload: any, @Response() response: FastifyReply): Promise<void> {
    const user = await this.userService.findByUsername(payload.username.toLowerCase());

    if ((user?.permission || 0) < PermissionEnum.HELPER)
      throw new BadRequestException("Du hast keine Berechtigung, dich hier einzuloggen.");

    if (user && (await compare(payload.password, user.password))) {
      const token = randomBytes(32).toString("base64url");

      user.clientToken = token;
      await this.userService.save(user);

      response.send({
        token: token,
      });
    }

    throw new BadRequestException("Username oder Passwort falsch");
  }

  @Post("kill")
  @UseGuards(ClientAuthGuard)
  async addKill(@User() user: IJwtUser, @Body() payload: AddKillDto): Promise<void> {
    const player = await this.playerService.findPlayerForLog(payload.killer);

    if (!player) {
      throw new BadRequestException("Der Spieler wurde nicht gefunden");
    }

    console.log(player.team);

    const stat = new StatsEntity({
      phase: payload.phase,
      team: player.team,
      round: payload.round,
      points: 1,
      reason: `${payload.killer} hat ${payload.killed} getötet`,
      userId: user.id,
      time: new Date(),
    });

    const entity = await this.statsService.saveLog(stat);
    this.socketService.sendStats(entity);
  }

  @Post("win")
  @UseGuards(ClientAuthGuard)
  async addWin(@User() user: IJwtUser, @Body() payload: AddWinDto): Promise<void> {
    const player = await this.playerService.findPlayerForLog(payload.player);

    if (!player) {
      throw new BadRequestException("Der Spieler wurde nicht gefunden");
    }

    const stat = new StatsEntity({
      phase: payload.phase,
      team: player.team,
      round: payload.round,
      points: 2,
      reason: `Runde ${payload.round + 1} gewonnen`,
      userId: user.id,
      time: new Date(),
    });

    const entity = await this.statsService.saveLog(stat);
    this.socketService.sendStats(entity);
  }
}
