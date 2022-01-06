import { IsAlphanumeric, IsNumber, IsString, Length } from "@nestjs/class-validator";

export class AddPhaseEntryDto {
  @IsNumber()
  teamId: number;

  @IsString()
  @Length(1, 1)
  group: string;

  @IsAlphanumeric()
  @Length(1, 5)
  phase: string;
}
