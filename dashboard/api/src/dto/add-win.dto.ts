import { IsNumber, IsString, Length } from "@nestjs/class-validator";

export class AddWinDto {
  @IsString()
  @Length(3, 16)
  player: string;

  @IsNumber()
  round: number;

  @IsString()
  @Length(1, 5)
  phase: string;
}
