import { IsEnum, IsOptional, IsString, Length } from "class-validator";
import { PermissionEnum } from "../enums/permission.enum";

export class EditUserDto {
  @IsOptional()
  @IsString()
  @Length(3, 16)
  username?: string;

  @IsOptional()
  @IsEnum(PermissionEnum)
  permission?: PermissionEnum;
}
