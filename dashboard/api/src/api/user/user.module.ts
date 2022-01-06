import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserController } from "./user.controller";
import { UserEntity } from "../../database/user.entity";
import { JwtWrapperModule } from "../../auth/jwt-wrapper.module";
import { UserService } from "../../services/user.service";
import { AuthService } from "../../services/auth.service";

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity]), JwtWrapperModule],
  controllers: [UserController],
  providers: [UserService, AuthService],
})
export class UserModule {}
