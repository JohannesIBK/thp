import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../../auth/auth.guard";
import { EntryEntity } from "../../database/entry.entity";
import { PhaseEntity } from "../../database/phase.entity";
import { TeamEntity } from "../../database/team.entity";
import { HasPermission } from "../../decorators/permission.decorator";
import { PhaseDto } from "../../dto/phase.dto";
import { SaveEntryDto } from "../../dto/save-entry.dto";
import { PermissionEnum } from "../../enums/permission.enum";
import { PhaseService } from "../../services/phase.service";

@Controller("phase")
export class PhaseController {
  constructor(private readonly phaseService: PhaseService) {}

  @Get()
  @HasPermission(PermissionEnum.ADMIN)
  @UseGuards(JwtAuthGuard)
  async get(): Promise<PhaseEntity[]> {
    return this.phaseService.findAll();
  }

  @Get("entry")
  @HasPermission(PermissionEnum.ADMIN)
  @UseGuards(JwtAuthGuard)
  async getEntries(): Promise<EntryEntity[]> {
    return this.phaseService.findAllEntries();
  }

  @Post("entry")
  @HasPermission(PermissionEnum.ADMIN)
  @UseGuards(JwtAuthGuard)
  async moveEntry(@Body() payload: SaveEntryDto): Promise<EntryEntity> {
    const entity = new EntryEntity({
      id: payload.id,
      team: new TeamEntity({ id: payload.teamId }),
      phase: payload.phase,
      group: payload.group,
    });

    return await this.phaseService.saveEntry(entity);
  }

  @Delete("entry/:id")
  @HasPermission(PermissionEnum.ADMIN)
  @UseGuards(JwtAuthGuard)
  async deleteEntry(@Param("id", new ParseIntPipe()) id: number): Promise<void> {
    await this.phaseService.delete({ id });
  }

  @Delete("entries/:phase")
  @HasPermission(PermissionEnum.ADMIN)
  @UseGuards(JwtAuthGuard)
  async deleteEntries(@Param() params: PhaseDto): Promise<void> {
    await this.phaseService.delete({ phase: params.phase });
  }
}
