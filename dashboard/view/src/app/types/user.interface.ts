import { PermissionEnum } from "./enums";

export interface ILoginResponse {
  token: string;
}

export interface IUser {
  id?: string;
  username: string;
  permission: PermissionEnum;
}

export interface ICreateUserPayload {
  username: string;
  permission: PermissionEnum;
  password: string;
}

export interface IEditUserPayload {
  username: string;
  permission: PermissionEnum;
}
