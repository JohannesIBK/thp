export interface IConfig {
  PG_URI: string;
  JWT_SECRET: string;
  COOKIE_SECRET: string;
  PORT: number;
  PRODUCTION: boolean;
}
