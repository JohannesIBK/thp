import { IsNumberString } from "@nestjs/class-validator";

export class IdDto {
  @IsNumberString()
  id: string;
}
