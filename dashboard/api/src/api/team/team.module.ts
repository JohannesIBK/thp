import { Module } from "@nestjs/common";
import { TeamController } from "./team.controller";
import { AuthService } from "../../services/auth.service";
import { UserService } from "../../services/user.service";
import { TeamService } from "../../services/team.service";
import { PlayerService } from "../../services/player.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PlayerEntity } from "../../database/player.entity";
import { TeamEntity } from "../../database/team.entity";
import { UserEntity } from "../../database/user.entity";
import { JwtWrapperModule } from "../../auth/jwt-wrapper.module";

@Module({
  imports: [TypeOrmModule.forFeature([PlayerEntity, TeamEntity, UserEntity]), JwtWrapperModule],
  controllers: [TeamController],
  providers: [AuthService, UserService, TeamService, PlayerService],
})
export class TeamModule {}
