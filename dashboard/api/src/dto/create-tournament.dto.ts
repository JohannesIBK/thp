import {
  ArrayMaxSize,
  ArrayMinSize,
  IsAlphanumeric,
  IsArray,
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  Max,
  MaxLength,
  Min,
  ValidateNested,
} from "class-validator";

class RoundDto {
  @IsString()
  @Length(2, 32)
  name: string;

  @IsString()
  @IsOptional()
  @MaxLength(256)
  description: string;

  @IsAlphanumeric()
  @Length(1, 16)
  acronym: string;

  @IsNumber()
  @Min(1)
  @Max(16)
  rounds: number;

  @IsNumber()
  @Min(2)
  @Max(1024)
  teams: number;

  @IsNumber()
  @Min(1)
  @Max(20)
  groups: number;
}

export class CreateTournamentDto {
  @IsString()
  @Length(3, 64)
  name: string;

  @IsString()
  @IsOptional()
  @MaxLength(1024)
  description: string;

  @IsNumber()
  @Min(1)
  @Max(4)
  teamSize: number;

  @IsBoolean()
  scrims: boolean;

  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(16)
  @ValidateNested({ each: true })
  phases: RoundDto[];

  @IsNumber()
  @Min(0)
  @Max(100)
  win: number;

  @IsNumber()
  @Min(0)
  @Max(100)
  kill: number;
}
