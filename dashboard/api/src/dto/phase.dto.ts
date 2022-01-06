import { IsAlphanumeric, Length } from "@nestjs/class-validator";

export class PhaseDto {
  @IsAlphanumeric()
  @Length(1, 5)
  phase: string;
}
