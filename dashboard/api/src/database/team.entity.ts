import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { IOptionalTeam } from "../types/team.interface";

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

  constructor(payload?: IOptionalTeam) {
    if (payload) {
      this.id = payload.id!;
      this.members = payload.members!;
      this.disqualified = payload.disqualified!;
      this.reason = payload.reason;
    }
  }
}
