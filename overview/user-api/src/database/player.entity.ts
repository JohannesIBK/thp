import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { TeamEntity } from "./team.entity";

@Entity({ name: "players" })
export class PlayerEntity {
  @PrimaryGeneratedColumn("uuid")
  uuid: string;

  @Column("varchar", { length: 16 })
  name: string;

  @ManyToOne(() => TeamEntity, (team) => team.players, { nullable: true, onDelete: "SET NULL" })
  team?: TeamEntity | null;
}
