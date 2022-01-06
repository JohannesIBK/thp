import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "teams" })
export class TeamEntity {
  @PrimaryGeneratedColumn({ type: "int" })
  id: number;

  @Column("smallint")
  members: number;

  @Column("boolean", { default: false })
  disqualified: boolean;

  @Column("varchar", { length: 512, nullable: true })
  reason?: string | null;
}
