import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindManyOptions, Repository } from "typeorm";
import { TeamEntity } from "../database/team.entity";

@Injectable()
export class TeamService {
  constructor(@InjectRepository(TeamEntity) private readonly teamRepository: Repository<TeamEntity>) {}

  find(options?: FindManyOptions<TeamEntity>): Promise<TeamEntity[]> {
    return this.teamRepository.find(options);
  }
}
