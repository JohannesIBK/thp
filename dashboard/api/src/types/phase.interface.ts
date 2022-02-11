import { TeamEntity } from "../database/team.entity";

export interface IOptionalPhase {
  id?: number;
  team?: TeamEntity;
  phase?: string;
  group?: string;
}
