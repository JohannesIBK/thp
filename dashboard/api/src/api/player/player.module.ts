import { Module } from "@nestjs/common";
import { PlayerController } from "./player.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from "../../database/user.entity";
import { PlayerEntity } from "../../database/player.entity";
import { JwtWrapperModule } from "../../auth/jwt-wrapper.module";
import { PlayerService } from "../../services/player.service";
import { UserService } from "../../services/user.service";
import { AuthService } from "../../services/auth.service";
import { TournamentService } from "../../services/tournament.service";
import { TournamentEntity } from "../../database/tournament.entity";
import { TeamEntity } from "../../database/team.entity";
import { TeamService } from "../../services/team.service";

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, PlayerEntity, TournamentEntity, TeamEntity]), JwtWrapperModule],
  controllers: [PlayerController],
  providers: [PlayerService, UserService, AuthService, TournamentService, TeamService],
})
export class PlayerModule {}
