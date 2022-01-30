import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { JwtWrapperModule } from "../../auth/jwt-wrapper.module";
import { PlayerEntity } from "../../database/player.entity";
import { TeamEntity } from "../../database/team.entity";
import { UserEntity } from "../../database/user.entity";
import { AuthService } from "../../services/auth.service";
import { PlayerService } from "../../services/player.service";
import { TeamService } from "../../services/team.service";
import { UserService } from "../../services/user.service";
import { TeamController } from "./team.controller";

@Module({
  imports: [TypeOrmModule.forFeature([PlayerEntity, TeamEntity, UserEntity]), JwtWrapperModule],
  controllers: [TeamController],
  providers: [AuthService, UserService, TeamService, PlayerService],
})
export class TeamModule {}
