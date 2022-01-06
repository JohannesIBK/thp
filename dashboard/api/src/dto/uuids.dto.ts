import { IsUUID } from "@nestjs/class-validator";

export class UuidsDto {
  @IsUUID(4, { each: true })
  uuids: string[];
}
