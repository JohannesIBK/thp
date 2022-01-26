import { IPhaseEntry } from "./phase.interface";
import { IPlayer } from "./player.interface";
import { IStats } from "./stats.interface";

export interface ITeam {
  id: number;
  members?: number;
  disqualified: boolean;
  reason?: string;
  players: IPlayer[];
  stats: IStats[];
  entries: IPhaseEntry[];
}

export interface ITeamWithData {
  team: ITeam;
  group: string;
  points: Map<number, number>;
}
