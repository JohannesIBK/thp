import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { IOptionalTeam } from "../types/team.interface";
import { PhaseEntryEntity } from "./phase-entry.entity";
import { PlayerEntity } from "./player.entity";
import { StatsEntity } from "./stats.entity";

@Entity({ name: "teams" })
export class TeamEntity {
  @PrimaryGeneratedColumn({ type: "int" })
  id: number;

  @Column("boolean", { default: false })
  disqualified: boolean;

  @Column("varchar", { length: 512, nullable: true })
  reason?: string | null;

  @OneToMany(() => PlayerEntity, (player) => player.team)
  players: PlayerEntity[];

  @OneToMany(() => PhaseEntryEntity, (entity) => entity.team, { onDelete: "CASCADE" })
  entities: PhaseEntryEntity[];

  @OneToMany(() => StatsEntity, (stats) => stats.team, { onDelete: "CASCADE" })
  stats: StatsEntity[];

  constructor(payload?: IOptionalTeam) {
    if (payload) {
      this.id = payload.id!;
      this.disqualified = payload.disqualified!;
      this.reason = payload.reason;
    }
  }
}
