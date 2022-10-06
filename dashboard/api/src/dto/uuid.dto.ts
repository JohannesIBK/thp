import { IsUUID } from "class-validator";

export class UuidDto {
  @IsUUID()
  uuid: string;
}
