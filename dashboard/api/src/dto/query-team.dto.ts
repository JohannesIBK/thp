import { IsNumber, IsOptional } from "@nestjs/class-validator";

export class QueryTeamDto {
  @IsNumber()
  id: number;

  @IsNumber()
  @IsOptional()
  round?: number;
}
