import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { IOptionalStats } from "../types/stats.interface";

@Entity({ name: "player_stats" })
export class StatsEntity {
  @PrimaryGeneratedColumn({ type: "int" })
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

  constructor(payload?: IOptionalStats) {
    if (payload) {
      this.id = payload.id!;
      this.reason = payload.reason!;
      this.phase = payload.phase!;
      this.round = payload.round!;
      this.teamId = payload.teamId!;
      this.points = payload.points!;
      this.userId = payload.userId!;
      this.time = payload.time!;
    }
  }
}
