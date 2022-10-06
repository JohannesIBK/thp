import { IsNumber, IsString, Length } from "class-validator";

export class AddWinDto {
  @IsString()
  @Length(3, 16)
  player: string;

  @IsNumber()
  round: number;

  @IsString()
  @Length(1, 16)
  phase: string;
}
