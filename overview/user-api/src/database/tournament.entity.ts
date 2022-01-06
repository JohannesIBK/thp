import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "tournaments" })
export class TournamentEntity {
  @PrimaryGeneratedColumn({ type: "int" })
  id: number;

  @Column("varchar", { length: 64 })
  name: string;

  @Column("varchar", { length: 1024, nullable: true })
  description?: string;

  @Column("smallint", { name: "team_size" })
  teamSize: number;

  @Column("boolean", { default: false })
  active: boolean;
}
