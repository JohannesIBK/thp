import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { FastifyAdapter, NestFastifyApplication } from "@nestjs/platform-fastify";
import { WINSTON_MODULE_NEST_PROVIDER } from "nest-winston";
import fastifyCookie from "fastify-cookie";
import { AppModule } from "./app.module";
import { ConfigService } from "@nestjs/config";
import { IConfig } from "./types/config.interface";

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter());
  const config = app.get<ConfigService<IConfig, true>>(ConfigService);

  app.setGlobalPrefix("api");
  // app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));
  app.useGlobalPipes(
    new ValidationPipe({
      validatorPackage: require("@nestjs/class-validator"),
      transformerPackage: require("@nestjs/class-transformer"),
    }),
  );

  if (!config.get("PRODUCTION")) {
    app.enableCors({ origin: "http://localhost:4200", credentials: true });
  }

  await app.register(fastifyCookie, {
    secret: config.get("COOKIE_SECRET"),
  });

  await app.listen(config.get("PORT"));
}
bootstrap();
