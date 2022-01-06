import { Body, Controller, Get, NotFoundException, Patch, Put, UseGuards } from "@nestjs/common";
import { TournamentService } from "../../services/tournament.service";
import { HasPermission } from "../../decorators/permission.decorator";
import { PermissionEnum } from "../../enums/permission.enum";
import { IJwtUser } from "../../types/jwt-user.interface";
import { User } from "../../decorators/user.decorator";
import { CreateTournamentDto } from "../../dto/create-tournament.dto";
import { JwtAuthGuard } from "../../auth/auth.guard";
import { TournamentEntity } from "../../database/tournament.entity";
import { PhaseService } from "../../services/phase.service";
import { PhaseEntity } from "../../database/phase.entity";
import { IExtendedTournamentResponse } from "../../types/response.interface";
import { IPhase } from "../../types/phase.interface";

@Controller("tournament")
export class TournamentController {
  constructor(private readonly tournamentService: TournamentService, private readonly phaseService: PhaseService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @HasPermission(PermissionEnum.ADMIN)
  async get(): Promise<IExtendedTournamentResponse> {
    const tournament = await this.tournamentService.findById(1);

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
    const tournament = await this.tournamentService.findById(1);
    if (!tournament) {
      throw new NotFoundException("Es wurde kein Turnier erstellt.");
    }

    await this.tournamentService.update({ active: true });
  }
}
