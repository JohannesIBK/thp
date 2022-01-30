export interface IOptionalTeam {
  id?: number;
  members?: number;
  disqualified?: boolean;
  reason?: string | null;
}
