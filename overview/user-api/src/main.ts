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
  app.useGlobalPipes(
    new ValidationPipe({
      transformerPackage: require("@nestjs/class-transformer"),
      validatorPackage: require("@nestjs/class-validator"),
    }),
  );

  if (!config.get("PRODUCTION")) {
    app.enableCors({ origin: "http://localhost:4242" });
  }

  await app.listen(config.get("PORT"));
}
bootstrap();
