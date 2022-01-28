import { PlayerEntity } from "../database/player.entity";
import { TeamEntity } from "../database/team.entity";

export interface ITeamsPlayersResponse {
  players: PlayerEntity[];
  teams: TeamEntity[];
}
