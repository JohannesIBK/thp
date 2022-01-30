import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from "../database/user.entity";
import { AuthService } from "../services/auth.service";
import { UserService } from "../services/user.service";
import { JwtWrapperModule } from "./jwt-wrapper.module";

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity]), JwtWrapperModule],
  providers: [AuthService, UserService],
})
export class AuthModule {}
