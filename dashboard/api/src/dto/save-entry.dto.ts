import { IsNumber, IsOptional, IsString, Length } from "class-validator";

export class SaveEntryDto {
  @IsNumber()
  @IsOptional()
  id: number;

  @IsString()
  @Length(1, 1)
  group: string;

  @IsString()
  @Length(1, 16)
  phase: string;

  @IsNumber()
  teamId: number;
}
