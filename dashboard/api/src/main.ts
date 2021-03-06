import { ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import { FastifyAdapter, NestFastifyApplication } from "@nestjs/platform-fastify";
import fastifyCookie from "fastify-cookie";
import { WINSTON_MODULE_NEST_PROVIDER } from "nest-winston";
import { AppModule } from "./app.module";
import { IConfig } from "./types/config.interface";

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter());
  const config = app.get<ConfigService<IConfig, true>>(ConfigService);

  app.setGlobalPrefix("api");
  app.useGlobalPipes(
    new ValidationPipe({
      validatorPackage: require("@nestjs/class-validator"),
      transformerPackage: require("@nestjs/class-transformer"),
    }),
  );

  if (!config.get("PRODUCTION")) {
    app.enableCors({ origin: "http://localhost:4200", credentials: true });
  } else {
    app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));
  }

  await app.register(fastifyCookie, {
    secret: config.get("COOKIE_SECRET"),
  });

  await app.listen(config.get("PORT"));
}
bootstrap();
