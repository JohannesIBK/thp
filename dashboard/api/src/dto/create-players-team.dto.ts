import { ValidateNested } from "class-validator";
import { CreatePlayerDto } from "./create-player.dto";

export class CreatePlayersTeamDto {
  @ValidateNested({ each: true })
  players: CreatePlayerDto[];
}
