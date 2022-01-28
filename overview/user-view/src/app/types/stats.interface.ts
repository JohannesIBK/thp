import { ITeam } from "./team.interface";

export interface IStats {
  id: number;
  phase: string;
  round: number;
  team: ITeam;
  points: number;
  reason: string;
  time: string;
  userId: number;
}
