import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { IConfig } from "./types/config.interface";
import { WinstonModule } from "nest-winston";
import { transports } from "winston";
import { JwtModule } from "@nestjs/jwt";
import { AuthModule } from "./auth/auth.module";
import { UserEntity } from "./database/user.entity";
import { validate } from "./config/config.validation";
import { UserModule } from "./api/user/user.module";
import { TournamentModule } from "./api/tournament/tournament.module";
import { TournamentEntity } from "./database/tournament.entity";
import { PlayerModule } from "./api/player/player.module";
import { PlayerEntity } from "./database/player.entity";
import { TeamEntity } from "./database/team.entity";
import { StatsEntity } from "./database/stats.entity";
import { PhaseEntity } from "./database/phase.entity";
import { PhaseModule } from "./api/phase/phase.module";
import { TeamModule } from "./api/team/team.module";
import { PhaseEntryEntity } from "./database/phase-entry.entity";
import { StatsModule } from "./api/stats/stats.module";
import { ClientModule } from "./api/client/client.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService<IConfig, true>) => ({
        type: "postgres",
        logging: !configService.get("PRODUCTION"),
        url: configService.get("PG_URI"),
        entities: [UserEntity, TournamentEntity, PlayerEntity, TeamEntity, StatsEntity, PhaseEntity, PhaseEntryEntity],
        synchronize: !configService.get("PRODUCTION"),
      }),
    }),
    WinstonModule.forRoot({
      level: "info",
      exitOnError: false,
      transports: [new transports.File({ filename: "./logs/combined.log" })],
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService<IConfig, true>) => ({
        secret: configService.get("JWT_SECRET"),
        signOptions: {
          expiresIn: "60s",
        },
      }),
    }),
    AuthModule,
    UserModule,
    TournamentModule,
    PlayerModule,
    PhaseModule,
    TeamModule,
    StatsModule,
    ClientModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
