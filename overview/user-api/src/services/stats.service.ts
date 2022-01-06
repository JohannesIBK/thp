import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindConditions, Repository } from "typeorm";
import { StatsEntity } from "../database/stats.entity";

@Injectable()
export class StatsService {
  constructor(@InjectRepository(StatsEntity) private readonly statsRepository: Repository<StatsEntity>) {}

  findLogs(condition: FindConditions<StatsEntity>): Promise<StatsEntity[]> {
    return this.statsRepository.find(condition);
  }

  findLog(condition: FindConditions<StatsEntity>): Promise<StatsEntity | undefined> {
    return this.statsRepository.findOne(condition);
  }
}
