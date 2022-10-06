import { IsString, Length } from "class-validator";

export class ChangePasswordDto {
  @IsString()
  @Length(8, 32)
  old: string;

  @IsString()
  @Length(8, 32)
  new: string;
}
