import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { JwtWrapperModule } from "../../auth/jwt-wrapper.module";
import { EntryEntity } from "../../database/entry.entity";
import { PhaseEntity } from "../../database/phase.entity";
import { PlayerEntity } from "../../database/player.entity";
import { TeamEntity } from "../../database/team.entity";
import { TournamentEntity } from "../../database/tournament.entity";
import { UserEntity } from "../../database/user.entity";
import { AuthService } from "../../services/auth.service";
import { PhaseService } from "../../services/phase.service";
import { RatelimitService } from "../../services/ratelimit.service";
import { TeamService } from "../../services/team.service";
import { TournamentService } from "../../services/tournament.service";
import { UserService } from "../../services/user.service";
import { TournamentController } from "./tournament.controller";

@Module({
  imports: [
    JwtWrapperModule,
    TypeOrmModule.forFeature([TournamentEntity, UserEntity, PhaseEntity, EntryEntity, TeamEntity, PlayerEntity]),
  ],
  controllers: [TournamentController],
  providers: [TournamentService, AuthService, UserService, PhaseService, TeamService, RatelimitService],
})
export class TournamentModule {}
