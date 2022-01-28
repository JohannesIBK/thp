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

  saveLog(entity: StatsEntity): Promise<StatsEntity> {
    return this.statsRepository.save(entity);
  }

  async delete(criteria: FindConditions<StatsEntity>): Promise<void> {
    await this.statsRepository.delete(criteria);
  }
}
