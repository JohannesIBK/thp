export interface IPlayer {
  uuid: string;
  name: string;
  team?: number | null;
}

export interface ICreatePlayer {
  uuid: string;
  name: string;
}
