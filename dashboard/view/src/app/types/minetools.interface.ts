export interface ICacheMinecraftUser {
  uuid: string;
  name: string;
  cached_at: Date;
}

export interface IMinetoolsResponse {
  id: string;
  name: string;
  status: "OK" | "ERR";
  cache: {
    HIT: boolean;
    cache_time: number;
    cache_time_left: number;
    cached_at: number;
    cached_until: number;
  };
}

export interface IMinecraftUser {
  name: string;
  uuid: string;
  cached?: boolean;
}
