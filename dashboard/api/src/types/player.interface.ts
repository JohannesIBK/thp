export interface IPlayer {
  uuid: string;
  name: string;
  team?: number | null;
}

export interface IOptionalPlayer {
  uuid: string;
  name?: string;
  team?: number;
}
