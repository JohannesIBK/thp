import { Column, Entity, ManyToOne, PrimaryColumn } from "typeorm";
import { TournamentEntity } from "./tournament.entity";

export interface IPhasePayload {
  name?: string;
  description?: string;
  acronym: string;
  rounds?: number;
  teams?: number;
  groups?: number;
}

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

  @ManyToOne(() => TournamentEntity, (tournament) => tournament.phases)
  tournament: TournamentEntity;

  constructor(payload?: IPhasePayload) {
    if (payload) {
      this.groups = payload.groups!;
      this.acronym = payload.acronym!;
      this.rounds = payload.rounds!;
      this.name = payload.name!;
      this.teams = payload.teams!;
      this.description = payload.description!;
    }
  }
}
