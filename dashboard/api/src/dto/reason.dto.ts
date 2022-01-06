import { IsString, MaxLength } from "@nestjs/class-validator";

export class ReasonDto {
  @IsString()
  @MaxLength(512)
  reason: string;
}
