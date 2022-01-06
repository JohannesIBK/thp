import { IsUUID } from "@nestjs/class-validator";

export class UuidDto {
  @IsUUID()
  uuid: string;
}
