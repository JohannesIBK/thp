import { IEntry } from "./phase.interface";
import { IPlayer } from "./player.interface";
import { IStats } from "./stats.interface";

export interface ITeam {
  id: number;
  members: number;
  disqualified: boolean;
  reason?: string;
  players: IPlayer[];
}

export interface ITeamWithStats extends ITeam {
  stats: IStats[];
}

export interface ITeamWithEntries extends ITeam {
  entries: IEntry[];
}

export type ITeamFullData = ITeamWithStats & ITeamWithEntries;

export interface ITeamWithEntryAndStats {
  team: ITeamFullData;
  entry?: number;
  points: number;
}

export interface ITeamStats<T = ITeam> {
  team: T;
  points: number;
  group: string;
}

export interface ITeamWithStats extends ITeam {
  group: string;
  points: number;
}

export interface ITeamsPlayersResponse {
  players: IPlayer[];
  teams: ITeam[];
}

export interface ITeamUploadData {
  username: string[];
  group: string;
}
