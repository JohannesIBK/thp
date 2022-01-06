import { Module } from "@nestjs/common";
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
import { PhaseEntryEntity } from "../../database/phase-entry.entity";

@Module({
  imports: [JwtWrapperModule, TypeOrmModule.forFeature([TournamentEntity, UserEntity, PhaseEntity, PhaseEntryEntity])],
  controllers: [TournamentController],
  providers: [TournamentService, AuthService, UserService, PhaseService],
})
export class TournamentModule {}
