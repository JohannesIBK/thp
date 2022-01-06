export interface ITeam {
  id: number;
  members: number;
  disqualified: boolean;
  reason?: string | null;
}

export interface IOptionalTeam {
  id?: number;
  members?: number;
  disqualified?: boolean;
  reason?: string | null;
}
