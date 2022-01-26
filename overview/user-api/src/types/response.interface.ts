import { PhaseEntity } from "../database/phase.entity";

export interface IExtendedTournamentResponse {
  id: number;
  name: string;
  description?: string | null;
  teamSize: number;
  active: boolean;
  phases: PhaseEntity[];
}
