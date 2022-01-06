import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity({ name: "phases" })
export class PhaseEntity {
  @PrimaryColumn("varchar", { length: 16 })
  acronym: string;

  @Column("varchar", { length: 64 })
  name: string;

  @Column("varchar", { length: 256, nullable: true })
  description?: string;

  @Column("smallint")
  rounds: number;

  @Column("smallint")
  teams: number;

  @Column("smallint")
  groups: number;
}
