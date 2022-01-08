import { Body, Controller, Delete, Get, NotFoundException, Patch, Put, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../../auth/auth.guard";
import { PhaseEntity } from "../../database/phase.entity";
import { TournamentEntity } from "../../database/tournament.entity";
import { HasPermission } from "../../decorators/permission.decorator";
import { User } from "../../decorators/user.decorator";
import { CreateTournamentDto } from "../../dto/create-tournament.dto";
import { PermissionEnum } from "../../enums/permission.enum";
import { PhaseService } from "../../services/phase.service";
import { StatsService } from "../../services/stats.service";
import { TeamService } from "../../services/team.service";
import { TournamentService } from "../../services/tournament.service";
import { IJwtUser } from "../../types/jwt-user.interface";
import { IPhase } from "../../types/phase.interface";
import { IExtendedTournamentResponse } from "../../types/response.interface";

@Controller("tournament")
export class TournamentController {
  constructor(
    private readonly tournamentService: TournamentService,
    private readonly phaseService: PhaseService,
    private readonly teamService: TeamService,
    private readonly statsService: StatsService,
  ) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @HasPermission(PermissionEnum.ADMIN)
  async get(): Promise<IExtendedTournamentResponse> {
    const tournament = await this.tournamentService.findOne();

    if (!tournament) {
      throw new NotFoundException("Es wurde kein Turnier erstellt.");
    }

    return {
      ...tournament,
      phases: await this.phaseService.findAll(),
    };
  }

  @Put()
  @UseGuards(JwtAuthGuard)
  @HasPermission(PermissionEnum.ADMIN)
  async create(@User() user: IJwtUser, @Body() payload: CreateTournamentDto): Promise<IExtendedTournamentResponse> {
    const entity = new TournamentEntity({
      id: 1,
      name: payload.name,
      description: payload.description,
      teamSize: payload.teamSize,
    });

    const phases: PhaseEntity[] = [];

    for (const phase of payload.phases) {
      const entity = new PhaseEntity({ ...phase });

      phases.push((await this.phaseService.create(entity)) as IPhase);
    }

    return {
      ...(await this.tournamentService.create(entity)),
      phases,
    };
  }

  @Patch("activate")
  @HasPermission(PermissionEnum.ADMIN)
  async activate(): Promise<void> {
    const tournament = await this.tournamentService.findOne();
    if (!tournament) {
      throw new NotFoundException("Es wurde kein Turnier erstellt.");
    }

    await this.tournamentService.update({ active: true });
  }

  @Delete()
  @HasPermission(PermissionEnum.ADMIN)
  async deleteTournament(): Promise<void> {
    await this.tournamentService.deleteTournament();
    await this.phaseService.deleteAll();
    await this.teamService.deleteAll();
    await this.statsService.delete({});
  }
}
