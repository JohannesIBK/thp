import { IsAlphanumeric, IsNumberString, Length } from "@nestjs/class-validator";

export class ResetRoundDto {
  @IsAlphanumeric()
  @Length(1, 5)
  phase: string;

  @IsNumberString()
  round: string;
}
