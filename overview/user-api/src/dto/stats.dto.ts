import { IsNumber } from "@nestjs/class-validator";
import { Column } from "typeorm";

export class StatsEntity {
  @IsNumber()
  id: number;

  @Column("varchar", { length: 5 })
  phase: string;

  @Column("smallint")
  round: number;

  @Column("int")
  teamId: number;

  @Column("smallint")
  points: number;

  @Column("varchar", { length: 128 })
  reason: string;

  @Column("int")
  userId: number;

  @Column("date")
  time: Date;
}
