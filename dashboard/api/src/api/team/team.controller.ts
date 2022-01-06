import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Put, Query, UseGuards } from "@nestjs/common";
import { HasPermission } from "../../decorators/permission.decorator";
import { IdDto } from "../../dto/id.dto";
import { ReasonDto } from "../../dto/reason.dto";
import { PermissionEnum } from "../../enums/permission.enum";
import { JwtAuthGuard } from "../../auth/auth.guard";
import { TeamService } from "../../services/team.service";
import { TeamEntity } from "../../database/team.entity";
import { UuidsDto } from "../../dto/uuids.dto";
import { PlayerService } from "../../services/player.service";
import { IExtendedTeamResponse, ITeamsPlayersResponse } from "../../types/response.interface";

@Controller("teams")
export class TeamController {
  constructor(private readonly teamService: TeamService, private readonly playerService: PlayerService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @HasPermission(PermissionEnum.ADMIN)
  getTeams(): Promise<TeamEntity[]> {
    return this.teamService.findAll();
  }

  @Get("players")
  @UseGuards(JwtAuthGuard)
  @HasPermission(PermissionEnum.ADMIN)
  async getTeamsWithPlayers(): Promise<ITeamsPlayersResponse> {
    const teams = await this.teamService.findAll();
    const players = await this.playerService.findAll();

    return {
      teams,
      players,
    };
  }

  @Put()
  @UseGuards(JwtAuthGuard)
  @HasPermission(PermissionEnum.ADMIN)
  async createTeam(@Body() payload: UuidsDto): Promise<IExtendedTeamResponse> {
    const team = await this.teamService.createTeamWithPlayers(payload.uuids);
    const players = await this.playerService.findByIds(payload.uuids);

    return {
      ...team,
      players: players,
    };
  }

  @Patch("qualify/:id")
  @UseGuards(JwtAuthGuard)
  @HasPermission(PermissionEnum.ADMIN)
  async qualifyTeam(@Param() params: IdDto): Promise<TeamEntity> {
    const entity = new TeamEntity({ id: parseInt(params.id), disqualified: false, reason: null });
    return await this.teamService.save(entity);
  }

  @Delete("qualify/:id")
  @UseGuards(JwtAuthGuard)
  @HasPermission(PermissionEnum.ADMIN)
  async disqualifyTeam(@Param() params: IdDto, @Query() payload: ReasonDto): Promise<TeamEntity> {
    const entity = new TeamEntity({ id: parseInt(params.id), disqualified: true, reason: payload.reason });
    return await this.teamService.save(entity);
  }

  @Delete(":id")
  @UseGuards(JwtAuthGuard)
  @HasPermission(PermissionEnum.ADMIN)
  async deleteTeam(@Param("id", new ParseIntPipe()) id: number): Promise<void> {
    await this.teamService.deleteTeam(id);
  }
}
