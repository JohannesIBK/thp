import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { JwtWrapperModule } from "../../auth/jwt-wrapper.module";
import { PlayerEntity } from "../../database/player.entity";
import { TeamEntity } from "../../database/team.entity";
import { TournamentEntity } from "../../database/tournament.entity";
import { UserEntity } from "../../database/user.entity";
import { AuthService } from "../../services/auth.service";
import { PlayerService } from "../../services/player.service";
import { TeamService } from "../../services/team.service";
import { TournamentService } from "../../services/tournament.service";
import { UserService } from "../../services/user.service";
import { PlayerController } from "./player.controller";

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, PlayerEntity, TournamentEntity, TeamEntity]), JwtWrapperModule],
  controllers: [PlayerController],
  providers: [PlayerService, UserService, AuthService, TournamentService, TeamService],
})
export class PlayerModule {}
