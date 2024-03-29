import {
  BadRequestException,
  Body,
  Controller,
  ForbiddenException,
  NotFoundException,
  Post,
  Response,
  UseGuards,
} from "@nestjs/common";
import { compare } from "bcrypt";
import { randomBytes } from "crypto";
import { FastifyReply } from "fastify";
import { ClientAuthGuard } from "../../auth/client-auth.guard";
import { EntryEntity } from "../../database/entry.entity";
import { PlayerEntity } from "../../database/player.entity";
import { StatsEntity } from "../../database/stats.entity";
import { TeamEntity } from "../../database/team.entity";
import { User } from "../../decorators/user.decorator";
import { AddKillDto } from "../../dto/add-kill.dto";
import { AddWinDto } from "../../dto/add-win.dto";
import { PermissionEnum } from "../../enums/permission.enum";
import { MojangService } from "../../services/mojang.service";
import { PhaseService } from "../../services/phase.service";
import { PlayerService } from "../../services/player.service";
import { SocketService } from "../../services/socket.service";
import { StatsService } from "../../services/stats.service";
import { TeamService } from "../../services/team.service";
import { TournamentService } from "../../services/tournament.service";
import { UserService } from "../../services/user.service";
import { IJwtUser } from "../../types/jwt-user.interface";

@Controller("client")
export class ClientController {
  constructor(
    private readonly userService: UserService,
    private readonly teamService: TeamService,
    private readonly statsService: StatsService,
    private readonly phaseService: PhaseService,
    private readonly playerService: PlayerService,
    private readonly socketService: SocketService,
    private readonly mojangService: MojangService,
    private readonly tournamentService: TournamentService,
  ) {}

  @Post("login")
  async login(@Body() payload: any, @Response() response: FastifyReply): Promise<void> {
    const user = await this.userService.findByUsername(payload.username.toLowerCase());

    if ((user?.permission || 0) < PermissionEnum.SCRIMS_HELPER) {
      throw new BadRequestException("Du hast keine Berechtigung, dich hier einzuloggen.");
    }

    if (user && (await compare(payload.password, user.password))) {
      const token = randomBytes(32).toString("base64url");

      user.clientToken = token;
      await this.userService.save(user);

      response.send({
        token,
      });
    }

    throw new BadRequestException("Username oder Passwort falsch");
  }

  @Post("kill")
  @UseGuards(ClientAuthGuard)
  async addKill(@User() user: IJwtUser, @Body() payload: AddKillDto): Promise<void> {
    const tournament = await this.tournamentService.findOne();
    if (!tournament) {
      throw new NotFoundException("Es wurde kein Turnier gefunden");
    }

    if (!tournament.scrims && user.permission === PermissionEnum.SCRIMS_HELPER) {
      throw new ForbiddenException("Du hast keine Berechtigungen bei Turnieren zu zählen.");
    }

    if (tournament.scrims && user.permission === PermissionEnum.TOURNAMENT_HELPER) {
      throw new ForbiddenException("Du hast keine Berechtigungen bei Scrims zu zählen.");
    }

    const player = await this.playerService.findPlayerForLog(payload.killer);
    let team = player?.team;

    if (!player) {
      if (!tournament.scrims) throw new BadRequestException("Der Spieler wurde nicht gefunden");

      const mcPlayer = await this.mojangService.getPlayerUUID(payload.killer);
      team = await this.teamService.save(new TeamEntity());

      const savedPlayer = await this.playerService.save(
        new PlayerEntity({ name: mcPlayer.name, team: new TeamEntity({ id: team.id }), uuid: mcPlayer.id }),
      );

      const entry = await this.phaseService.saveEntry(
        new EntryEntity({
          phase: "scrims",
          group: "A",
          team: new TeamEntity({ id: team.id }),
        }),
      );

      team.entries = [entry];
      team.players = [savedPlayer];
    }

    const stat = new StatsEntity({
      phase: payload.phase,
      round: payload.round,
      points: tournament.kill,
      reason: `${payload.killer} hat ${payload.killed} getötet`,
      userId: user.id,
      time: new Date(),
      team,
    });

    const entity = await this.statsService.saveLog(stat);
    this.socketService.sendStats(entity);
  }

  @Post("win")
  @UseGuards(ClientAuthGuard)
  async addWin(@User() user: IJwtUser, @Body() payload: AddWinDto): Promise<void> {
    const tournament = await this.tournamentService.findOne();
    if (!tournament) {
      throw new NotFoundException("Es wurde kein Turnier gefunden");
    }

    if (!tournament.scrims && user.permission === PermissionEnum.SCRIMS_HELPER) {
      throw new ForbiddenException("Du hast keine Berechtigungen bei Turnieren zu zählen.");
    }

    if (tournament.scrims && user.permission === PermissionEnum.TOURNAMENT_HELPER) {
      throw new ForbiddenException("Du hast keine Berechtigungen bei Scrims zu zählen.");
    }

    const player = await this.playerService.findPlayerForLog(payload.player);
    let team = player?.team;
    if (!player) {
      if (!tournament.scrims) throw new BadRequestException("Der Spieler wurde nicht gefunden");

      const mcPlayer = await this.mojangService.getPlayerUUID(payload.player);
      team = await this.teamService.save(new TeamEntity());

      const savedPlayer = await this.playerService.save(
        new PlayerEntity({ name: mcPlayer.name, team: new TeamEntity({ id: team.id }), uuid: mcPlayer.id }),
      );

      const entry = await this.phaseService.saveEntry(
        new EntryEntity({
          phase: "scrims",
          group: "A",
          team: new TeamEntity({ id: team.id }),
        }),
      );

      team.entries = [entry];
      team.players = [savedPlayer];
    }

    const stat = new StatsEntity({
      phase: payload.phase,
      round: payload.round,
      points: tournament.win,
      reason: `Hat eine Runde gewonnen (${payload.round + 1})`,
      userId: user.id,
      time: new Date(),
      team,
    });

    const entity = await this.statsService.saveLog(stat);
    this.socketService.sendStats(entity);
  }
}
