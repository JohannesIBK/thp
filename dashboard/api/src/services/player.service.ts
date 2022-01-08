import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeleteResult, FindOneOptions, InsertResult, Repository } from "typeorm";
import { PlayerEntity } from "../database/player.entity";
import { CreatePlayerDto } from "../dto/create-player.dto";

@Injectable()
export class PlayerService {
  constructor(@InjectRepository(PlayerEntity) private readonly playerRepository: Repository<PlayerEntity>) {}

  findAll(): Promise<PlayerEntity[]> {
    return this.playerRepository.find();
  }

  save(player: PlayerEntity | CreatePlayerDto): Promise<PlayerEntity> {
    return this.playerRepository.save(player);
  }

  createMany(players: PlayerEntity[] | CreatePlayerDto[]): Promise<InsertResult> {
    return this.playerRepository.insert(players);
  }

  delete(uuid: string): Promise<DeleteResult> {
    return this.playerRepository.createQueryBuilder().delete().whereInIds(uuid).returning("team").execute();
  }

  deleteAll(): Promise<DeleteResult> {
    return this.playerRepository.delete({});
  }

  findOne(condition: FindOneOptions<PlayerEntity>): Promise<PlayerEntity | undefined> {
    return this.playerRepository.findOne(condition);
  }

  findByIds(uuids: string[]): Promise<PlayerEntity[]> {
    return this.playerRepository.findByIds(uuids);
  }
}
