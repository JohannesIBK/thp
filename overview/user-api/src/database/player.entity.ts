import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "players" })
export class PlayerEntity {
  @PrimaryGeneratedColumn("uuid")
  uuid: string;

  @Column("varchar", { length: 16 })
  name: string;

  @Column("int", { nullable: true })
  team?: number;
}
