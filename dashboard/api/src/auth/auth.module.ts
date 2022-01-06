import { Module } from "@nestjs/common";
import { AuthService } from "../services/auth.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from "../database/user.entity";
import { JwtWrapperModule } from "./jwt-wrapper.module";
import { UserService } from "../services/user.service";

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity]), JwtWrapperModule],
  providers: [AuthService, UserService],
})
export class AuthModule {}
