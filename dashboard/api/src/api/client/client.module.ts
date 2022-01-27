import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { EntryEntity } from "../../database/entry.entity";
import { PhaseEntity } from "../../database/phase.entity";
import { PlayerEntity } from "../../database/player.entity";
import { StatsEntity } from "../../database/stats.entity";
import { TeamEntity } from "../../database/team.entity";
import { TournamentEntity } from "../../database/tournament.entity";
import { UserEntity } from "../../database/user.entity";
import { MojangService } from "../../services/mojang.service";
import { PhaseService } from "../../services/phase.service";
import { PlayerService } from "../../services/player.service";
import { SocketService } from "../../services/socket.service";
import { StatsService } from "../../services/stats.service";
import { TeamService } from "../../services/team.service";
import { TournamentService } from "../../services/tournament.service";
import { UserService } from "../../services/user.service";
import { ClientController } from "./client.controller";

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, StatsEntity, PlayerEntity, TeamEntity, PhaseEntity, EntryEntity, TournamentEntity]),
    HttpModule,
  ],
  controllers: [ClientController],
  providers: [UserService, StatsService, PlayerService, SocketService, TeamService, MojangService, PhaseService, TournamentService],
})
export class ClientModule {}
