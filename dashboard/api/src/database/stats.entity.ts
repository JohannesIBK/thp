import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { IOptionalStats } from "../types/stats.interface";
import { TeamEntity } from "./team.entity";

@Entity({ name: "player_stats" })
export class StatsEntity {
  @PrimaryGeneratedColumn({ type: "int" })
  id: number;

  @Column("varchar", { length: 5 })
  phase: string;

  @Column("smallint")
  round: number;

  @ManyToOne(() => TeamEntity, (team) => team.stats)
  team: TeamEntity;

  @Column("smallint")
  points: number;

  @Column("varchar", { length: 128 })
  reason: string;

  @Column("int")
  userId: number;

  @Column("timestamptz")
  time: Date;

  constructor(payload?: IOptionalStats) {
    if (payload) {
      this.id = payload.id!;
      this.reason = payload.reason!;
      this.phase = payload.phase!;
      this.round = payload.round!;
      this.team = payload.team!;
      this.points = payload.points!;
      this.userId = payload.userId!;
      this.time = payload.time!;
    }
  }
}
