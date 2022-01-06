import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { IConfig } from "../types/config.interface";

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService<IConfig, true>) => ({
        secret: configService.get("JWT_SECRET"),
        signOptions: {
          expiresIn: "900s",
        },
      }),
    }),
  ],
  providers: [],
  exports: [JwtModule],
})
export class JwtWrapperModule {}
