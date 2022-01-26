export interface IPhase {
  name: string;
  description?: string;
  acronym: string;
  rounds: number;
  teams: number;
  groups: number;
}

export interface IEntry {
  id: number;
  team: {
    id: number;
  };
  group: string;
  phase: string;
}

export interface IEntryCreate {
  id?: number;
  teamId: number;
  group: string;
  phase: string;
}
