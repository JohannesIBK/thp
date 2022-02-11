export interface IConfig {
  PG_URI: string;
  VIEW_SERVER: string;
  JWT_SECRET: string;
  COOKIE_SECRET: string;
  PORT: number;
  PRODUCTION: boolean;
}
