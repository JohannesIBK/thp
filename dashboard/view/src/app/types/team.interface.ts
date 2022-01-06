import { IPlayer } from "./player.interface";

export interface ITeam {
  id: number;
  members: number;
  disqualified: boolean;
  reason?: string;
}

export interface ITeamWithPlayers extends ITeam {
  players: IPlayer[];
}

export interface ITeamWithEntry extends ITeamWithPlayers {
  entry?: number;
}

export interface ITeamWithEntryAndStats extends ITeamWithPlayers {
  entry?: number;
  points: number;
}

export interface ITeamWithStats extends ITeamWithPlayers {
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
