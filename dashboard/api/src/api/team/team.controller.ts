import { Body, Controller, Delete, ForbiddenException, Get, Param, ParseIntPipe, Patch, Put, Query, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../../auth/auth.guard";
import { TeamEntity } from "../../database/team.entity";
import { HasPermission } from "../../decorators/permission.decorator";
import { IdDto } from "../../dto/id.dto";
import { ReasonDto } from "../../dto/reason.dto";
import { UuidsDto } from "../../dto/uuids.dto";
import { PermissionEnum } from "../../enums/permission.enum";
import { PlayerService } from "../../services/player.service";
import { TeamService } from "../../services/team.service";
import { ITeamsPlayersResponse } from "../../types/response.interface";

@Controller("teams")
export class TeamController {
  constructor(private readonly teamService: TeamService, private readonly playerService: PlayerService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @HasPermission(PermissionEnum.ADMIN)
  async getTeams(): Promise<ITeamsPlayersResponse> {
    const teams = await this.teamService.find({ relations: ["players"] });
    // @ts-ignore
    const players = await this.playerService.find({ where: { team: null } });

    return { teams, players };
  }

  @Get("stats")
  @UseGuards(JwtAuthGuard)
  @HasPermission(PermissionEnum.ADMIN)
  async getTeamsWithStats(): Promise<TeamEntity[]> {
    return this.teamService.find({
      join: {
        alias: "team",
        leftJoinAndSelect: {
          "team.players": "players",
          "team.stats": "stats",
        },
      },
      select: [],
    });
  }

  @Get("data")
  @UseGuards(JwtAuthGuard)
  @HasPermission(PermissionEnum.ADMIN)
  async getFullData(): Promise<TeamEntity[]> {
    return this.teamService.find({ relations: ["players", "stats", "entries"] });
  }

  @Put()
  @UseGuards(JwtAuthGuard)
  @HasPermission(PermissionEnum.ADMIN)
  async createTeam(@Body() payload: UuidsDto): Promise<TeamEntity> {
    const team = await this.teamService.createTeamWithPlayers(payload.uuids);

    return (await this.teamService.findOne({ where: { id: team.id }, relations: ["players"] }))!;
  }

  @Put(":id")
  @UseGuards(JwtAuthGuard)
  @HasPermission(PermissionEnum.ADMIN)
  async saveTeam(@Body() payload: UuidsDto, @Param() params: IdDto): Promise<TeamEntity> {
    const team = await this.teamService.findOne({ where: { id: parseInt(params.id, 10) } });
    if (!team) throw new ForbiddenException("Das Team wurde nicht gefunden");

    await this.playerService.update({ team: { id: team.id } }, { team: null });
    await this.playerService.update(payload.uuids, { team });

    return (await this.teamService.findOne({ where: { id: team.id }, relations: ["players"] }))!;
  }

  @Patch("qualify/:id")
  @UseGuards(JwtAuthGuard)
  @HasPermission(PermissionEnum.ADMIN)
  async qualifyTeam(@Param() params: IdDto): Promise<TeamEntity> {
    const entity = new TeamEntity({ id: parseInt(params.id, 10), disqualified: false, reason: null });
    return this.teamService.save(entity);
  }

  @Delete("qualify/:id")
  @UseGuards(JwtAuthGuard)
  @HasPermission(PermissionEnum.ADMIN)
  async disqualifyTeam(@Param() params: IdDto, @Query() payload: ReasonDto): Promise<TeamEntity> {
    const entity = new TeamEntity({ id: parseInt(params.id, 10), disqualified: true, reason: payload.reason });
    return this.teamService.save(entity);
  }

  @Delete(":id")
  @UseGuards(JwtAuthGuard)
  @HasPermission(PermissionEnum.ADMIN)
  async deleteTeam(@Param("id", new ParseIntPipe()) id: number): Promise<void> {
    await this.teamService.deleteTeam(id);
  }
}
