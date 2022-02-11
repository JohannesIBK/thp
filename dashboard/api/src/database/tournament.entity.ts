import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { IOptionalTournament } from "../types/tournament.interface";
import { PhaseEntity } from "./phase.entity";

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

  @Column("boolean", { default: false })
  scrims: boolean;

  @Column("smallint")
  win: number;

  @Column("smallint")
  kill: number;

  @OneToMany(() => PhaseEntity, (phase) => phase.tournament)
  phases: PhaseEntity[];

  constructor(payload?: IOptionalTournament) {
    if (payload) {
      this.id = payload.id!;
      this.name = payload.name!;
      this.description = payload.description!;
      this.teamSize = payload.teamSize!;
      this.active = payload.active!;
      this.scrims = payload.scrims!;
      this.win = payload.win!;
      this.kill = payload.kill!;
    }
  }
}
