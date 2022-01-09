import { BadRequestException, Controller, Get } from "@nestjs/common";
import { PhaseService } from "../../services/phase.service";
import { PlayerService } from "../../services/player.service";
import { StatsService } from "../../services/stats.service";
import { TeamService } from "../../services/team.service";
import { TournamentService } from "../../services/tournament.service";
import { IDataResponse, IExtendedTournamentResponse } from "../../types/response.interface";

@Controller("stats")
export class StatsController {
  constructor(
    private readonly tournamentService: TournamentService,
    private readonly phaseService: PhaseService,
    private readonly teamService: TeamService,
    private readonly statsService: StatsService,
    private readonly playerService: PlayerService,
  ) {}

  @Get("tournament")
  async getTournament(): Promise<IExtendedTournamentResponse> {
    const tournament = await this.tournamentService.findOne();
    if (!tournament) throw new BadRequestException("Derzeit läuft kein Turnier");

    const phases = await this.phaseService.findAll();

    return {
      ...tournament,
      phases,
    };
  }

  @Get("data")
  async getData(): Promise<IDataResponse> {
    const teams = await this.teamService.findAll();
    const players = await this.playerService.findAll();
    const relations = await this.phaseService.findAllEntries();
    const stats = await this.statsService.findLogs({});

    return {
      stats,
      relations,
      teams,
      players,
    };
  }
}
