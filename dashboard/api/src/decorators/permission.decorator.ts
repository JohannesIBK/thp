import { SetMetadata } from "@nestjs/common";
import { PermissionEnum } from "../enums/permission.enum";

export const HasPermission = (permission: PermissionEnum) => SetMetadata("permission", permission);
