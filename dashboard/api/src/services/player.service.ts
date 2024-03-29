import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeleteResult, FindOptionsWhere, FindManyOptions, FindOneOptions, InsertResult, Repository, UpdateResult } from "typeorm";
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity";
import { PlayerEntity } from "../database/player.entity";
import { CreatePlayerDto } from "../dto/create-player.dto";

@Injectable()
export class PlayerService {
  constructor(@InjectRepository(PlayerEntity) private readonly playerRepository: Repository<PlayerEntity>) {}

  findAll(): Promise<PlayerEntity[]> {
    return this.playerRepository.find();
  }

  find(options?: FindManyOptions<PlayerEntity>): Promise<PlayerEntity[]> {
    return this.playerRepository.find(options);
  }

  save(player: PlayerEntity | CreatePlayerDto): Promise<PlayerEntity> {
    return this.playerRepository.save(player);
  }

  createMany(players: PlayerEntity[] | CreatePlayerDto[]): Promise<InsertResult> {
    return this.playerRepository.insert(players);
  }

  delete(uuid: string): Promise<DeleteResult> {
    return this.playerRepository.createQueryBuilder().delete().whereInIds(uuid).returning('"teamId"').execute();
  }

  findOne(condition: FindOneOptions<PlayerEntity>): Promise<PlayerEntity | null> {
    return this.playerRepository.findOne(condition);
  }

  update(
    criteria: FindOptionsWhere<PlayerEntity> | string | string[],
    team: QueryDeepPartialEntity<PlayerEntity>,
  ): Promise<UpdateResult> {
    return this.playerRepository.update(criteria, team);
  }

  findByIds(uuids: string[]): Promise<PlayerEntity[]> {
    return this.playerRepository.findByIds(uuids);
  }

  async findPlayerForLog(name: string): Promise<PlayerEntity | null> {
    return this.playerRepository
      .createQueryBuilder("player")
      .innerJoinAndSelect("player.team", "team", "player.teamId = team.id")
      .where("player.name = :name", { name })
      .select(["player.uuid", "team.id"])
      .getOne();
  }
}
