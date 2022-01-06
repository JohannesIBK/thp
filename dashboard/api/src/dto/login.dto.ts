import { IsNotEmpty, IsString, Length } from "@nestjs/class-validator";

export class LoginDto {
  @Length(3, 16)
  username: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
