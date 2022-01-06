import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOneOptions, Repository } from "typeorm";
import { PlayerEntity } from "../database/player.entity";

@Injectable()
export class PlayerService {
  constructor(@InjectRepository(PlayerEntity) private readonly playerRepository: Repository<PlayerEntity>) {}

  findAll(): Promise<PlayerEntity[]> {
    return this.playerRepository.find();
  }

  findOne(condition: FindOneOptions<PlayerEntity>): Promise<PlayerEntity | undefined> {
    return this.playerRepository.findOne(condition);
  }

  findByIds(uuids: string[]): Promise<PlayerEntity[]> {
    return this.playerRepository.findByIds(uuids);
  }
}
