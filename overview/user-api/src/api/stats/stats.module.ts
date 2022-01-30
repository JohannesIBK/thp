import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TeamEntity } from "../../database/team.entity";
import { TournamentEntity } from "../../database/tournament.entity";
import { TeamService } from "../../services/team.service";
import { TournamentService } from "../../services/tournament.service";
import { StatsController } from "./stats.controller";
import { StatsGateway } from "./stats.gateway";

@Module({
  imports: [TypeOrmModule.forFeature([TournamentEntity, TeamEntity])],
  controllers: [StatsController],
  providers: [TournamentService, TeamService, StatsGateway],
})
export class StatsModule {}
