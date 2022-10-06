import { IsAlphanumeric, IsNumberString, Length } from "class-validator";

export class ResetRoundDto {
  @IsAlphanumeric()
  @Length(1, 16)
  phase: string;

  @IsNumberString()
  round: string;
}
