import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { TeamEntity } from "./team.entity";

@Entity({ name: "stats" })
export class StatsEntity {
  @PrimaryGeneratedColumn({ type: "int" })
  id: number;

  @Column("varchar", { length: 16 })
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
}
