import { Column, Entity, JoinColumn, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { IOptionalTeam } from "../types/team.interface";
import { PhaseEntryEntity } from "./phase-entry.entity";
import { PlayerEntity } from "./player.entity";

@Entity({ name: "teams" })
export class TeamEntity {
  @PrimaryGeneratedColumn({ type: "int" })
  id: number;

  @Column("boolean", { default: false })
  disqualified: boolean;

  @Column("varchar", { length: 512, nullable: true })
  reason?: string | null;

  @OneToMany(() => PlayerEntity, (player) => player.uuid)
  players: PlayerEntity[];

  // @OneToMany(() => PhaseEntryEntity, (entity) => entity.team, { onDelete: "CASCADE" })
  // entities: PhaseEntryEntity[];

  constructor(payload?: IOptionalTeam) {
    if (payload) {
      this.id = payload.id!;
      this.disqualified = payload.disqualified!;
      this.reason = payload.reason;
    }
  }
}
