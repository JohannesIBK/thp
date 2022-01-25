import { TeamEntity } from "../database/team.entity";

export interface IOptionalStats {
  id?: number;
  phase?: string;
  round?: number;
  team?: TeamEntity | null;
  points?: number;
  reason?: string;
  userId?: number;
  time?: Date;
}
