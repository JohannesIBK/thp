import { PhaseEntity } from "../database/phase.entity";
import { PlayerEntity } from "../database/player.entity";
import { TeamEntity } from "../database/team.entity";

export interface IExtendedTournamentResponse {
  id: number;
  name: string;
  description?: string | null;
  teamSize: number;
  active: boolean;
  phases: PhaseEntity[];
}

export interface ITeamsPlayersResponse {
  players: PlayerEntity[];
  teams: TeamEntity[];
}
