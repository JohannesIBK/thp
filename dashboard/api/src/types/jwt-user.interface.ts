import { PermissionEnum } from "../enums/permission.enum";

export interface IJwtUser {
  username: string;
  permission: PermissionEnum;
  id: number;
}
