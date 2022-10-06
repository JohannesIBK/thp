import fastifyCookie from "@fastify/cookie";
import { ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import { FastifyAdapter, NestFastifyApplication } from "@nestjs/platform-fastify";
import { AppModule } from "./app.module";
import { IConfig } from "./types/config.interface";

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter());
  const config = app.get<ConfigService<IConfig, true>>(ConfigService);

  app.setGlobalPrefix("api");
  app.useGlobalPipes(new ValidationPipe());

  if (!config.get("PRODUCTION")) {
    app.enableCors({ origin: "http://localhost:4200", credentials: true });
  }

  await app.register(fastifyCookie, {
    secret: config.get("COOKIE_SECRET"),
  });

  await app.listen(config.get("PORT"));
}

bootstrap();
