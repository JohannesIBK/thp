import { BadRequestException, Body, Controller, Post, Response, UseGuards, Request } from "@nestjs/common";
import { compare } from "bcrypt";
import { randomBytes } from "crypto";
import { FastifyReply, FastifyRequest } from "fastify";
import { ClientAuthGuard } from "../../auth/client-auth.guard";
import { StatsEntity } from "../../database/stats.entity";
import { User } from "../../decorators/user.decorator";
import { AddKillDto } from "../../dto/add-kill.dto";
import { AddWinDto } from "../../dto/add-win.dto";
import { LoginDto } from "../../dto/login.dto";
import { PlayerService } from "../../services/player.service";
import { StatsService } from "../../services/stats.service";
import { UserService } from "../../services/user.service";
import { IJwtUser } from "../../types/jwt-user.interface";

@Controller("client")
export class ClientController {
  constructor(
    private readonly userService: UserService,
    private readonly statsService: StatsService,
    private readonly playerService: PlayerService,
  ) {}

  @Post("login")
  async login(@Body() payload: any, @Response() response: FastifyReply): Promise<void> {
    const user = await this.userService.findByUsername(payload.username.toLowerCase());

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
    const player = await this.playerService.findOne({
      where: {
        name: payload.killer,
      },
    });

    if (!player) {
      throw new BadRequestException("Der Spieler wurde nicht gefunden");
    }

    const stat = new StatsEntity({
      phase: payload.phase,
      teamId: player?.team,
      round: payload.round,
      points: 1,
      reason: `${payload.killer} killed ${payload.killed}`,
      userId: user.id,
      time: new Date(),
    });

    await this.statsService.saveLog(stat);
  }

  @Post("win")
  @UseGuards(ClientAuthGuard)
  async addWin(@User() user: IJwtUser, @Body() payload: AddWinDto): Promise<void> {
    const player = await this.playerService.findOne({
      where: {
        name: payload.player,
      },
    });

    if (!player) {
      throw new BadRequestException("Der Spieler wurde nicht gefunden");
    }

    const stat = new StatsEntity({
      phase: payload.phase,
      teamId: player?.team,
      round: payload.round,
      points: 2,
      reason: "Win",
      userId: user.id,
      time: new Date(),
    });

    await this.statsService.saveLog(stat);
  }
}
