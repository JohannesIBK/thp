import { TeamEntity } from "../database/team.entity";

export interface IPhase {
  name: string;
  description: string;
  acronym: string;
  rounds: number;
  teams: number;
  groups: number;
}

export interface IOptionalPhase {
  id?: number;
  team?: TeamEntity;
  phase?: string;
  group?: string;
}
