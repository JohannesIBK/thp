import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { IConfig } from "../types/config.interface";

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService<IConfig, true>) => ({
        secret: configService.get("JWT_SECRET"),
        signOptions: {
          expiresIn: "180s",
        },
      }),
    }),
  ],
  providers: [],
  exports: [JwtModule],
})
export class JwtWrapperModule {}
