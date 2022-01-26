import { BadRequestException, Controller, Get } from "@nestjs/common";
import { TeamEntity } from "../../database/team.entity";
import { PhaseService } from "../../services/phase.service";
import { TeamService } from "../../services/team.service";
import { TournamentService } from "../../services/tournament.service";
import { IExtendedTournamentResponse } from "../../types/response.interface";

@Controller("stats")
export class StatsController {
  constructor(
    private readonly tournamentService: TournamentService,
    private readonly phaseService: PhaseService,
    private readonly teamService: TeamService,
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
  async getData(): Promise<TeamEntity[]> {
    return await this.teamService.find({ relations: ["players", "entries", "stats"] });
  }
}
