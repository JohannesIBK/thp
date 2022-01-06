import { PhaseEntryEntity } from "../database/phase-entry.entity";
import { PhaseEntity } from "../database/phase.entity";
import { PlayerEntity } from "../database/player.entity";
import { StatsEntity } from "../database/stats.entity";
import { TeamEntity } from "../database/team.entity";

export interface IExtendedTournamentResponse {
  id: number;
  name: string;
  description?: string | null;
  teamSize: number;
  active: boolean;
  phases: PhaseEntity[];
}

export interface IDataResponse {
  players: PlayerEntity[];
  teams: TeamEntity[];
  relations: PhaseEntryEntity[];
  stats: StatsEntity[];
}
