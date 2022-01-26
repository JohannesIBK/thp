import { Column, Entity, Index, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { TeamEntity } from "./team.entity";

@Entity({ name: "entries" })
@Index(["phase", "teamId"], { unique: true })
export class EntryEntity {
  @PrimaryGeneratedColumn({ type: "int" })
  id: number;

  @ManyToOne(() => TeamEntity, (team) => team.entries, { onDelete: "CASCADE" })
  team: TeamEntity;

  // needed for unique index field
  @Column("int")
  private teamId: number;

  @Column("varchar", { length: 5 })
  phase: string;

  @Column("char")
  group: string;
}
