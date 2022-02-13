import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { PermissionEnum } from "../enums/permission.enum";
import { IUserPayload } from "../types/user.interface";

@Entity({ name: "users" })
export class UserEntity {
  @PrimaryGeneratedColumn({ type: "int" })
  id: number;

  @Column("varchar", { length: 16, unique: true })
  username: string;

  @Column("varchar", { length: 60 })
  password: string;

  @Column("enum", { enum: PermissionEnum, default: PermissionEnum.USER })
  permission: PermissionEnum;

  @Column("varchar", { length: 43, nullable: true })
  refreshToken?: string | null;

  @Column("varchar", { length: 43, nullable: true })
  clientToken?: string | null;

  constructor(payload?: IUserPayload) {
    if (payload) {
      this.id = payload.id!;
      this.username = payload.username!;
      this.password = payload.password!;
      this.permission = payload.permission!;
      this.refreshToken = payload.refreshToken!;
    }
  }
}
