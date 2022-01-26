import { IPhase } from "./phase.interface";

export interface Round {
  id: number;
  code: string;
}

export interface ICreateTournamentPayload {
  name: string;
  teamSize: number;
  sheetId: string;
  rounds: Round[];
}

export interface ITournament {
  id: string;
  name: string;
  description: string | null;
  teamSize: number;
  active: boolean;
  phases: IPhase[];
  scrims: boolean;
}
