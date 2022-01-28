import { BadRequestException, Body, Controller, Delete, Get, NotFoundException, Param, Put, UseGuards } from "@nestjs/common";
import { PlayerEntity } from "../../database/player.entity";
import { PlayerService } from "../../services/player.service";
import { JwtAuthGuard } from "../../auth/auth.guard";
import { HasPermission } from "../../decorators/permission.decorator";
import { PermissionEnum } from "../../enums/permission.enum";
import { CreatePlayerDto } from "../../dto/create-player.dto";
import { UuidDto } from "../../dto/uuid.dto";
import { CreatePlayersTeamDto } from "../../dto/create-players-team.dto";
import { TournamentService } from "../../services/tournament.service";
import { TeamService } from "../../services/team.service";

@Controller("player")
export class PlayerController {
  constructor(
    private readonly playerService: PlayerService,
    private readonly tournamentService: TournamentService,
    private readonly teamService: TeamService,
  ) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @HasPermission(PermissionEnum.ADMIN)
  async getAllPlayers(): Promise<PlayerEntity[]> {
    return this.playerService.findAll();
  }

  @Put()
  @UseGuards(JwtAuthGuard)
  @HasPermission(PermissionEnum.ADMIN)
  async createPlayer(@Body() payload: CreatePlayerDto): Promise<PlayerEntity[]> {
    try {
      await this.playerService.save(payload);

      return await this.playerService.findAll();
    } catch (e) {
      throw new BadRequestException("Der Spieler ist bereits abgespeichert.");
    }
  }

  @Put("team")
  @UseGuards(JwtAuthGuard)
  @HasPermission(PermissionEnum.ADMIN)
  async createPlayersAsTeam(@Body() payload: CreatePlayersTeamDto): Promise<PlayerEntity[]> {
    const tournament = await this.tournamentService.findOne();
    if (!tournament) throw new NotFoundException("Es wurde kein Turnier gefunden");

    if (payload.players.length !== tournament.teamSize)
      throw new BadRequestException(`Es müssen ${tournament.teamSize} Spieler angegeben werden`);

    const uuids = payload.players.map((p) => p.uuid);
    const savedPlayers = await this.playerService.findByIds(uuids);
    if (savedPlayers.length) throw new BadRequestException("Einige Spieler sind bereits abgespeichert.");

    await this.playerService.createMany(payload.players);
    await this.teamService.createTeamWithPlayers(uuids);

    return await this.playerService.findAll();
  }

  @Delete(":uuid")
  @UseGuards(JwtAuthGuard)
  @HasPermission(PermissionEnum.ADMIN)
  async deletePlayer(@Param() params: UuidDto): Promise<void> {
    const player = await this.playerService.delete(params.uuid);

    if (!player.raw.length) throw new BadRequestException("Der Spieler wurde nicht gefunden");

    const teamId = player.raw[0].teamId as number | null;
    if (teamId) {
      await this.teamService.removePlayer(teamId);
    }
  }
}
