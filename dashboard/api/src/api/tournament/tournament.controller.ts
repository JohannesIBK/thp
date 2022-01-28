import { Body, Controller, Delete, Get, NotFoundException, Patch, Put, Response, UseGuards } from "@nestjs/common";
import { exec } from "child_process";
import { FastifyReply } from "fastify";
import { createReadStream } from "fs";
import * as util from "util";
import * as path from "path";
import { JwtAuthGuard } from "../../auth/auth.guard";
import { PhaseEntity } from "../../database/phase.entity";
import { TournamentEntity } from "../../database/tournament.entity";
import { HasPermission } from "../../decorators/permission.decorator";
import { User } from "../../decorators/user.decorator";
import { CreateTournamentDto } from "../../dto/create-tournament.dto";
import { PermissionEnum } from "../../enums/permission.enum";
import { PhaseService } from "../../services/phase.service";
import { RatelimitService } from "../../services/ratelimit.service";
import { StatsService } from "../../services/stats.service";
import { TeamService } from "../../services/team.service";
import { TournamentService } from "../../services/tournament.service";
import { IJwtUser } from "../../types/jwt-user.interface";

const exec_p = util.promisify(exec);

@Controller("tournament")
export class TournamentController {
  constructor(
    private readonly tournamentService: TournamentService,
    private readonly ratelimitService: RatelimitService,
    private readonly phaseService: PhaseService,
    private readonly teamService: TeamService,
    private readonly statsService: StatsService,
  ) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @HasPermission(PermissionEnum.ADMIN)
  async get(): Promise<TournamentEntity> {
    const tournament = await this.tournamentService.findOne();

    if (!tournament) {
      throw new NotFoundException("Es wurde kein Turnier erstellt.");
    }

    return tournament;
  }

  @Get("backup")
  @UseGuards(JwtAuthGuard)
  @HasPermission(PermissionEnum.ADMIN)
  async createBackup(@Response() response: FastifyReply): Promise<void> {
    const sql_dump = path.join(__dirname, "..", "..", "..");

    if (this.ratelimitService.consumePoint()) {
      await exec_p(`pg_dump -T users thp > ${sql_dump}/thp.sql`);
    }

    response.send(createReadStream(sql_dump + "/thp.sql"));
  }

  @Put()
  @UseGuards(JwtAuthGuard)
  @HasPermission(PermissionEnum.ADMIN)
  async create(@User() user: IJwtUser, @Body() payload: CreateTournamentDto): Promise<TournamentEntity> {
    const entity = new TournamentEntity({
      id: 1,
      name: payload.name,
      description: payload.description,
      teamSize: payload.teamSize,
      scrims: payload.scrims,
    });
    const tournament = await this.tournamentService.create(entity);

    const phases: PhaseEntity[] = [];

    for (const phase of payload.phases) {
      const entity = new PhaseEntity({ ...phase });
      entity.tournament = tournament;
      phases.push(entity);
    }

    await this.phaseService.create(phases);

    return (await this.tournamentService.findOne()) as TournamentEntity;
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
