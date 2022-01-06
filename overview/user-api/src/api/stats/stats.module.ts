import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PhaseEntryEntity } from "../../database/phase-entry.entity";
import { PhaseEntity } from "../../database/phase.entity";
import { PlayerEntity } from "../../database/player.entity";
import { StatsEntity } from "../../database/stats.entity";
import { TeamEntity } from "../../database/team.entity";
import { TournamentEntity } from "../../database/tournament.entity";
import { PhaseService } from "../../services/phase.service";
import { PlayerService } from "../../services/player.service";
import { StatsService } from "../../services/stats.service";
import { TeamService } from "../../services/team.service";
import { TournamentService } from "../../services/tournament.service";
import { StatsController } from "./stats.controller";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      TournamentEntity,
      PhaseEntryEntity,
      PhaseEntity,
      PhaseEntryEntity,
      PlayerEntity,
      TeamEntity,
      StatsEntity,
    ]),
  ],
  controllers: [StatsController],
  providers: [TournamentService, PhaseService, TeamService, StatsService, PlayerService],
})
export class StatsModule {}
