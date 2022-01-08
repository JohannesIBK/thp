import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindConditions, InsertResult, Repository } from "typeorm";
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity";
import { PhaseEntryEntity } from "../database/phase-entry.entity";
import { PhaseEntity } from "../database/phase.entity";

@Injectable()
export class PhaseService {
  constructor(
    @InjectRepository(PhaseEntity) private readonly phaseRepository: Repository<PhaseEntity>,
    @InjectRepository(PhaseEntryEntity) private readonly phaseEntryRepository: Repository<PhaseEntryEntity>,
  ) {}

  create(phase: PhaseEntity): Promise<PhaseEntity> {
    return this.phaseRepository.save(phase);
  }

  findAllEntries(): Promise<PhaseEntryEntity[]> {
    return this.phaseEntryRepository.find();
  }

  saveEntry(entity: PhaseEntryEntity): Promise<PhaseEntryEntity> {
    return this.phaseEntryRepository.save(entity);
  }

  updateEntry(criteria: QueryDeepPartialEntity<PhaseEntryEntity>): Promise<InsertResult> {
    return this.phaseEntryRepository.upsert(criteria, { conflictPaths: ["phase", "teamId"] });
  }

  async delete(condition: FindConditions<PhaseEntryEntity>): Promise<void> {
    await this.phaseEntryRepository.delete(condition);
  }

  findById(acronym: string): Promise<PhaseEntity | undefined> {
    return this.phaseRepository.findOne(acronym);
  }

  findAll(): Promise<PhaseEntity[]> {
    return this.phaseRepository.find();
  }

  async deleteAll(): Promise<void> {
    await this.phaseEntryRepository.delete({});
    await this.phaseRepository.delete({});
  }
}
