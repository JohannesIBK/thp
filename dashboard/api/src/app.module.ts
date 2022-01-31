import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { TypeOrmModule } from "@nestjs/typeorm";
import { WinstonModule } from "nest-winston";
import { transports } from "winston";
import { ClientModule } from "./api/client/client.module";
import { PhaseModule } from "./api/phase/phase.module";
import { PlayerModule } from "./api/player/player.module";
import { StatsModule } from "./api/stats/stats.module";
import { TeamModule } from "./api/team/team.module";
import { TournamentModule } from "./api/tournament/tournament.module";
import { UserModule } from "./api/user/user.module";
import { AuthModule } from "./auth/auth.module";
import { validate } from "./config/config.validation";
import { EntryEntity } from "./database/entry.entity";
import { PhaseEntity } from "./database/phase.entity";
import { PlayerEntity } from "./database/player.entity";
import { StatsEntity } from "./database/stats.entity";
import { TeamEntity } from "./database/team.entity";
import { TournamentEntity } from "./database/tournament.entity";
import { UserEntity } from "./database/user.entity";
import { IConfig } from "./types/config.interface";

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
        entities: [UserEntity, TournamentEntity, PlayerEntity, TeamEntity, StatsEntity, PhaseEntity, EntryEntity],
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
