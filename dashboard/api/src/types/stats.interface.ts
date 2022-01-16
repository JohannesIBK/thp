export interface IOptionalStats {
  id?: number;
  phase?: string;
  round?: number;
  teamId?: number | null;
  points?: number;
  reason?: string;
  userId?: number;
  time?: Date;
}
