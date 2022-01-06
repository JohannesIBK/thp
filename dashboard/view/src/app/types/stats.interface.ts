export interface IStats {
  id: number;
  phase: string;
  round: number;
  teamId: number;
  points: number;
}

export interface ICreateStats {
  reason: string;
  teamId: number;
  round: string;
  points: number;
  phase: string;
}
