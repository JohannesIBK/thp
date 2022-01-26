import { IsNumber, IsOptional, IsString, Length } from "@nestjs/class-validator";

export class SaveEntryDto {
  @IsNumber()
  @IsOptional()
  id: number;

  @IsString()
  @Length(1, 1)
  group: string;

  @IsString()
  @Length(1, 5)
  phase: string;

  @IsNumber()
  teamId: number;
}
