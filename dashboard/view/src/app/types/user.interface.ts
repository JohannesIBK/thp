import { Permission } from "./enums";

export interface ILoginResponse {
  token: string;
}

export interface IUser {
  id?: string;
  username: string;
  permission: Permission;
}

export interface ICreateUserPayload {
  username: string;
  permission: Permission;
  password: string;
}

export interface IEditUserPayload {
  username: string;
  permission: Permission;
}
