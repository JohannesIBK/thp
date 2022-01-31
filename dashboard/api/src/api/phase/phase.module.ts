import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { JwtWrapperModule } from "../../auth/jwt-wrapper.module";
import { EntryEntity } from "../../database/entry.entity";
import { PhaseEntity } from "../../database/phase.entity";
import { UserEntity } from "../../database/user.entity";
import { AuthService } from "../../services/auth.service";
import { PhaseService } from "../../services/phase.service";
import { UserService } from "../../services/user.service";
import { PhaseController } from "./phase.controller";

@Module({
  imports: [TypeOrmModule.forFeature([PhaseEntity, UserEntity, EntryEntity]), JwtWrapperModule],
  controllers: [PhaseController],
  providers: [UserService, AuthService, PhaseService],
})
export class PhaseModule {}
