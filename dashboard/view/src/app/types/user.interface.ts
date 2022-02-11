import { PermissionEnum } from "./enums";

export interface ILoginResponse {
  token: string;
}

export interface IUser {
  id?: number;
  username: string;
  permission: PermissionEnum;
}

export interface ICreateUserPayload {
  username: string;
  permission: PermissionEnum;
  password: string;
}
