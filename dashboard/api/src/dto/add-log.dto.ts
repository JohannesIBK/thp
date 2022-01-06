import { IsNumber, IsPositive, IsString, Length, Max, Min } from "@nestjs/class-validator";

export class AddLogDto {
  @IsString()
  @Length(1, 5)
  phase: string;

  @IsString()
  @Length(1, 128)
  reason: string;

  @IsNumber()
  @IsPositive()
  @Max(16)
  round: number;

  @IsNumber()
  @IsPositive()
  teamId: number;

  @IsNumber()
  @Max(10)
  @Min(-10)
  points: number;
}
