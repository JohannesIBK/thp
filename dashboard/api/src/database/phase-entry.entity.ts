import { Column, Entity, Index, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { TeamEntity } from "./team.entity";
import { IOptionalPhase } from "../types/phase.interface";

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

  constructor(payload?: IOptionalPhase) {
    if (payload) {
      this.id = payload.id!;
      this.phase = payload.phase!;
      this.team = payload.team!;
      this.teamId = payload.teamId!;
      this.group = payload.group!;
    }
  }
}
