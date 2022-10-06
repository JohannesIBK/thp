import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../../auth/auth.guard";
import { StatsEntity } from "../../database/stats.entity";
import { TeamEntity } from "../../database/team.entity";
import { HasPermission } from "../../decorators/permission.decorator";
import { User } from "../../decorators/user.decorator";
import { AddLogDto } from "../../dto/add-log.dto";
import { PhaseDto } from "../../dto/phase.dto";
import { QueryTeamDto } from "../../dto/query-team.dto";
import { ResetRoundDto } from "../../dto/reset-round.dto";
import { PermissionEnum } from "../../enums/permission.enum";
import { SocketService } from "../../services/socket.service";
import { StatsService } from "../../services/stats.service";
import { IJwtUser } from "../../types/jwt-user.interface";

@Controller("stats")
export class StatsController {
  constructor(private readonly statsService: StatsService, private readonly socketService: SocketService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @HasPermission(PermissionEnum.ADMIN)
  async getAllStats(): Promise<StatsEntity[]> {
    return this.statsService.findLogs({});
  }

  @Get("phase/:phase")
  @UseGuards(JwtAuthGuard)
  @HasPermission(PermissionEnum.ADMIN)
  async getPhaseStats(@Param() params: PhaseDto): Promise<StatsEntity[]> {
    return this.statsService.findLogs({ where: { phase: params.phase } });
  }

  @Put()
  @UseGuards(JwtAuthGuard)
  @HasPermission(PermissionEnum.ADMIN)
  @HttpCode(200)
  async addLog(@User() user: IJwtUser, @Body() payload: AddLogDto): Promise<StatsEntity[]> {
    const team = new TeamEntity({ id: payload.teamId });
    const stat = new StatsEntity({
      phase: payload.phase,
      team,
      round: payload.round,
      points: payload.points,
      reason: payload.reason,
      userId: user.id,
      time: new Date(),
    });

    const entity = await this.statsService.saveLog(stat);
    this.socketService.sendStats(entity);

    return this.statsService.findLogs({ where: { team: { id: team.id }, phase: payload.phase } });
  }

  @Post("team/:phase")
  @UseGuards(JwtAuthGuard)
  @HasPermission(PermissionEnum.ADMIN)
  @HttpCode(200)
  async getTeamPhaseStats(@Param() params: PhaseDto, @Body() payload: QueryTeamDto): Promise<StatsEntity[]> {
    if (payload.round)
      return this.statsService.findLogs({
        where: {
          phase: params.phase,
          team: { id: payload.id },
          round: payload.round,
        },
      });
    return this.statsService.findLogs({ where: { phase: params.phase, team: { id: payload.id } } });
  }

  @Delete(":phase/:round")
  @HasPermission(PermissionEnum.ADMIN)
  @UseGuards(JwtAuthGuard)
  async resetRound(@Param() params: ResetRoundDto): Promise<void> {
    await this.statsService.delete({ phase: params.phase, round: parseInt(params.round, 10) });
  }
}
