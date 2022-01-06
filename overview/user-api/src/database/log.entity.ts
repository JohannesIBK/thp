import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "logs" })
export class LogEntity {
  @PrimaryGeneratedColumn({ type: "int" })
  id: number;

  @Column("varchar", { length: 5 })
  round: string;

  @Column("varchar", { length: 16 })
  player: string;

  @Column("varchar")
  points: number;

  @Column("varchar", { length: 64 })
  reason: string;
}
