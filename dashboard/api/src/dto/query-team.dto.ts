import { IsNumber, IsOptional } from "class-validator";

export class QueryTeamDto {
  @IsNumber()
  id: number;

  @IsNumber()
  @IsOptional()
  round?: number;
}
