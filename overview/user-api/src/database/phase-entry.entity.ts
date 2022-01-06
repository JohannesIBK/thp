import { Column, Entity, Index, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { TeamEntity } from "./team.entity";

@Entity({ name: "phase_entries" })
@Index(["phase", "teamId"], { unique: true })
export class PhaseEntryEntity {
  @PrimaryGeneratedColumn({ type: "int" })
  id: number;

  @ManyToOne(() => TeamEntity)
  team: TeamEntity;

  @Column("int")
  teamId: number;

  @Column("varchar", { length: 5 })
  phase: string;

  @Column("char")
  group: string;
}
