import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { TeamEntity } from "../database/team.entity";

@Injectable()
export class TeamService {
  constructor(@InjectRepository(TeamEntity) private readonly teamRepository: Repository<TeamEntity>) {}

  findAll(): Promise<TeamEntity[]> {
    return this.teamRepository.find();
  }
}
