import {
  Body,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
} from "@nestjs/common";
import { TeamEntity } from "../../database/team.entity";
import { PhaseService } from "../../services/phase.service";
import { PhaseEntity } from "../../database/phase.entity";
import { JwtAuthGuard } from "../../auth/auth.guard";
import { PermissionEnum } from "../../enums/permission.enum";
import { HasPermission } from "../../decorators/permission.decorator";
import { AddPhaseEntryDto } from "../../dto/add-phase-entry.dto";
import { PhaseEntryEntity } from "../../database/phase-entry.entity";
import { EditPhaseEntryDto } from "../../dto/edit-phase-entry.dto";
import { PhaseDto } from "../../dto/phase.dto";

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
  async getEntries(): Promise<PhaseEntryEntity[]> {
    return this.phaseService.findAllEntries();
  }

  @Put("entry")
  @HasPermission(PermissionEnum.ADMIN)
  @UseGuards(JwtAuthGuard)
  async addEntry(@Body() payload: AddPhaseEntryDto): Promise<PhaseEntryEntity> {
    const response = await this.phaseService.updateEntry({
      phase: payload.phase,
      group: payload.group,
      team: new TeamEntity({ id: payload.teamId }),
    });

    if (!response.generatedMaps.length) throw new InternalServerErrorException("Das Team konnte nicht verschoben werden.");

    return new PhaseEntryEntity({
      phase: payload.phase,
      group: payload.group,
      teamId: payload.teamId,
      id: response.generatedMaps[0].id,
    });
  }

  @Post("entry")
  @HasPermission(PermissionEnum.ADMIN)
  @UseGuards(JwtAuthGuard)
  async moveEntry(@Body() payload: EditPhaseEntryDto): Promise<PhaseEntryEntity> {
    const entity = new PhaseEntryEntity({
      id: payload.id,
      teamId: payload.teamId,
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
