import { BadRequestException, Controller, Get } from "@nestjs/common";
import { TeamEntity } from "../../database/team.entity";
import { TournamentEntity } from "../../database/tournament.entity";
import { TeamService } from "../../services/team.service";
import { TournamentService } from "../../services/tournament.service";

@Controller("stats")
export class StatsController {
  constructor(private readonly tournamentService: TournamentService, private readonly teamService: TeamService) {}

  @Get("tournament")
  async getTournament(): Promise<TournamentEntity> {
    const tournament = await this.tournamentService.findOne();
    if (!tournament) throw new BadRequestException("Derzeit läuft kein Turnier");

    return tournament;
  }

  @Get("data")
  async getData(): Promise<TeamEntity[]> {
    return this.teamService.find({ relations: ["players", "entries", "stats"] });
  }
}
