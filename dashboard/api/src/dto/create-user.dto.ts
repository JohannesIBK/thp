import { IsEnum, IsString, Length } from "@nestjs/class-validator";
import { PermissionEnum } from "../enums/permission.enum";

export class CreateUserDto {
  @IsString()
  @Length(3, 16)
  username: string;

  @IsEnum(PermissionEnum)
  permission: PermissionEnum;

  @IsString()
  @Length(8, 32)
  password: string;
}
