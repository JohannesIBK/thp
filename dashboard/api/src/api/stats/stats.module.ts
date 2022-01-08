import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { JwtWrapperModule } from "../../auth/jwt-wrapper.module";
import { StatsEntity } from "../../database/stats.entity";
import { UserEntity } from "../../database/user.entity";
import { AuthService } from "../../services/auth.service";
import { SocketService } from "../../services/socket.service";
import { StatsService } from "../../services/stats.service";
import { UserService } from "../../services/user.service";
import { StatsController } from "./stats.controller";

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, StatsEntity]), JwtWrapperModule],
  controllers: [StatsController],
  providers: [AuthService, UserService, StatsService, SocketService],
})
export class StatsModule {}
