import { IsNumber, IsString, Length } from "@nestjs/class-validator";

export class AddKillDto {
  @IsString()
  @Length(3, 16)
  killer: string;

  @IsString()
  @Length(3, 16)
  killed: string;

  @IsNumber()
  round: number;

  @IsString()
  @Length(1, 5)
  phase: string;
}
