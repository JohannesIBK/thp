import { IsAscii, IsString, IsUUID, Length } from "class-validator";

export class CreatePlayerDto {
  @IsUUID(4)
  uuid: string;

  @IsString()
  @Length(3, 16)
  @IsAscii()
  name: string;
}
