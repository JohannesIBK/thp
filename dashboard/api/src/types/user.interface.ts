import { PermissionEnum } from "../enums/permission.enum";

export interface IUserPayload {
  username?: string;
  permission?: PermissionEnum;
  id?: number;
  password?: string;
  refreshToken?: string;
}
