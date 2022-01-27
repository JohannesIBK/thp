import { TeamEntity } from "../database/team.entity";

export interface IOptionalPlayer {
  uuid: string;
  name?: string;
  team?: TeamEntity;
}
