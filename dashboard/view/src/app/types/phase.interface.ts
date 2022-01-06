export interface IPhase {
  name: string;
  description: string;
  acronym: string;
  rounds: number;
  teams: number;
  groups: number;
}

export interface IPhaseEntry {
  id: number;
  teamId: number;
  group: string;
  phase: string;
}

export interface IPhaseEntryCreate {
  id?: number;
  teamId: number;
  group: string;
  phase: string;
}
