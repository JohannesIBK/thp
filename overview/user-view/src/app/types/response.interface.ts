import { IPhaseEntry } from "./phase.interface";
import { IPlayer } from "./player.interface";
import { IStats } from "./stats.interface";
import { ITeam } from "./team.interface";

export interface IDataResponse {
  players: IPlayer[];
  teams: ITeam[];
  relations: IPhaseEntry[];
  stats: IStats[];
}
