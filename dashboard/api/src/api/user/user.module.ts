import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { JwtWrapperModule } from "../../auth/jwt-wrapper.module";
import { UserEntity } from "../../database/user.entity";
import { AuthService } from "../../services/auth.service";
import { UserService } from "../../services/user.service";
import { UserController } from "./user.controller";

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity]), JwtWrapperModule],
  controllers: [UserController],
  providers: [UserService, AuthService],
})
export class UserModule {}
