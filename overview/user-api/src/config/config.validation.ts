import { plainToClass } from "@nestjs/class-transformer";
import { IsBooleanString, IsNotEmpty, IsNumber, IsString, validateSync } from "@nestjs/class-validator";
import { IConfig } from "../types/config.interface";

class ConfigValidation {
  @IsBooleanString()
  PRODUCTION: string;

  @IsNumber()
  PORT: number;

  @IsString()
  @IsNotEmpty()
  PG_URI: string;
}

export function validate(config: Record<string, unknown>): IConfig {
  const validatedConfig = plainToClass(ConfigValidation, config, { enableImplicitConversion: true });
  const errors = validateSync(validatedConfig, { skipMissingProperties: false });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }

  return {
    PRODUCTION: validatedConfig.PRODUCTION === "true",
    PORT: validatedConfig.PORT,
    PG_URI: validatedConfig.PG_URI,
  };
}
