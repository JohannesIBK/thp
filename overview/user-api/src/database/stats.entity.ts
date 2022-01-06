import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

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
}
