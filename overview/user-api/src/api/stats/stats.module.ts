import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { EntryEntity } from "../../database/entry.entity";
import { PhaseEntity } from "../../database/phase.entity";
import { PlayerEntity } from "../../database/player.entity";
import { StatsEntity } from "../../database/stats.entity";
import { TeamEntity } from "../../database/team.entity";
import { TournamentEntity } from "../../database/tournament.entity";
import { PhaseService } from "../../services/phase.service";
import { TeamService } from "../../services/team.service";
import { TournamentService } from "../../services/tournament.service";
import { StatsController } from "./stats.controller";
import { StatsGateway } from "./stats.gateway";

@Module({
  imports: [TypeOrmModule.forFeature([TournamentEntity, PhaseEntity, PlayerEntity, TeamEntity, StatsEntity])],
  controllers: [StatsController],
  providers: [TournamentService, PhaseService, TeamService, EntryEntity, StatsGateway],
})
export class StatsModule {}
