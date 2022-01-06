import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PlayerEntity } from "../../database/player.entity";
import { StatsEntity } from "../../database/stats.entity";
import { UserEntity } from "../../database/user.entity";
import { PlayerService } from "../../services/player.service";
import { StatsService } from "../../services/stats.service";
import { UserService } from "../../services/user.service";
import { ClientController } from "./client.controller";

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, StatsEntity, PlayerEntity])],
  controllers: [ClientController],
  providers: [UserService, StatsService, PlayerService],
})
export class ClientModule {}
