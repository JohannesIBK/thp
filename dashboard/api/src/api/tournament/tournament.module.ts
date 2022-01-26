import { Module } from "@nestjs/common";
import { PlayerEntity } from "../../database/player.entity";
import { StatsEntity } from "../../database/stats.entity";
import { TeamEntity } from "../../database/team.entity";
import { RatelimitService } from "../../services/ratelimit.service";
import { StatsService } from "../../services/stats.service";
import { TeamService } from "../../services/team.service";
import { TournamentController } from "./tournament.controller";
import { TournamentService } from "../../services/tournament.service";
import { JwtWrapperModule } from "../../auth/jwt-wrapper.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TournamentEntity } from "../../database/tournament.entity";
import { UserEntity } from "../../database/user.entity";
import { AuthService } from "../../services/auth.service";
import { UserService } from "../../services/user.service";
import { PhaseService } from "../../services/phase.service";
import { PhaseEntity } from "../../database/phase.entity";
import { EntryEntity } from "../../database/entry.entity";

@Module({
  imports: [
    JwtWrapperModule,
    TypeOrmModule.forFeature([TournamentEntity, UserEntity, PhaseEntity, EntryEntity, TeamEntity, PlayerEntity, StatsEntity]),
  ],
  controllers: [TournamentController],
  providers: [TournamentService, AuthService, UserService, PhaseService, TeamService, StatsService, RatelimitService],
})
export class TournamentModule {}
