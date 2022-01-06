import { Module } from "@nestjs/common";
import { PhaseController } from "./phase.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PhaseEntity } from "../../database/phase.entity";
import { JwtWrapperModule } from "../../auth/jwt-wrapper.module";
import { UserService } from "../../services/user.service";
import { AuthService } from "../../services/auth.service";
import { PhaseService } from "../../services/phase.service";
import { UserEntity } from "../../database/user.entity";
import { PhaseEntryEntity } from "../../database/phase-entry.entity";

@Module({
  imports: [TypeOrmModule.forFeature([PhaseEntity, UserEntity, PhaseEntryEntity]), JwtWrapperModule],
  controllers: [PhaseController],
  providers: [UserService, AuthService, PhaseService],
})
export class PhaseModule {}
