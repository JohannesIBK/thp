import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { ThrottlerModule } from "@nestjs/throttler";
import { TypeOrmModule } from "@nestjs/typeorm";
import { StatsModule } from "./api/stats/stats.module";
import { validate } from "./config/config.validation";
import { EntryEntity } from "./database/entry.entity";
import { PhaseEntity } from "./database/phase.entity";
import { PlayerEntity } from "./database/player.entity";
import { StatsEntity } from "./database/stats.entity";
import { TeamEntity } from "./database/team.entity";
import { TournamentEntity } from "./database/tournament.entity";
import { IConfig } from "./types/config.interface";

@Module({
  imports: [
    ConfigModule.forRoot({ validate }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService<IConfig, true>) => ({
        type: "postgres",
        url: configService.get("PG_URI"),
        entities: [TournamentEntity, TeamEntity, PlayerEntity, StatsEntity, EntryEntity, PhaseEntity],
      }),
    }),
    ThrottlerModule.forRoot({
      ttl: 30,
      limit: 10,
    }),
    StatsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
