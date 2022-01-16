import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { IOptionalPlayer } from "../types/player.interface";

@Entity({ name: "players" })
export class PlayerEntity {
  @PrimaryGeneratedColumn("uuid")
  uuid: string;

  @Column("varchar", { length: 16 })
  name: string;

  @Column("int", { nullable: true })
  team?: number | null;

  constructor(payload?: IOptionalPlayer) {
    if (payload) {
      this.uuid = payload.uuid;
      this.name = payload.name!;
      this.team = payload.team;
    }
  }
}
