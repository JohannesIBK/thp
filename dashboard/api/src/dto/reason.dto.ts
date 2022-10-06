import { IsString, MaxLength } from "class-validator";

export class ReasonDto {
  @IsString()
  @MaxLength(512)
  reason: string;
}
