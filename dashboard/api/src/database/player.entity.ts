import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { IOptionalPlayer } from "../types/player.interface";
import { TeamEntity } from "./team.entity";

@Entity({ name: "players" })
export class PlayerEntity {
  @PrimaryGeneratedColumn("uuid")
  uuid: string;

  @Column("varchar", { length: 16 })
  name: string;

  @OneToOne(() => TeamEntity, { nullable: true, onDelete: "SET NULL" })
  @JoinColumn()
  team?: TeamEntity | null;

  constructor(payload?: IOptionalPlayer) {
    if (payload) {
      this.uuid = payload.uuid;
      this.name = payload.name!;
      if (Number.isInteger(payload.team)) {
        this.team = new TeamEntity({ id: payload.team });
      }
    }
  }
}
