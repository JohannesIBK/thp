export interface ICacheMinecraftUser {
  uuid: string;
  name: string;
  cached_at: Date;
}

export interface MojangResponse {
  name: string;
  id: string;
}

export interface IMinecraftUser {
  name: string;
  uuid: string;
}
