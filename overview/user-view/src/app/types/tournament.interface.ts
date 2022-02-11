import { IPhase } from "./phase.interface";

export interface ITournament {
  id: string;
  name: string;
  description: string | null;
  teamSize: number;
  active: boolean;
  scrims: boolean;
  phases: IPhase[];
}
