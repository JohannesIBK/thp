import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { InsertResult, Repository } from "typeorm";
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity";
import { PhaseEntryEntity } from "../database/phase-entry.entity";
import { PhaseEntity } from "../database/phase.entity";

@Injectable()
export class PhaseService {
  constructor(
    @InjectRepository(PhaseEntity) private readonly phaseRepository: Repository<PhaseEntity>,
    @InjectRepository(PhaseEntryEntity) private readonly phaseEntryRepository: Repository<PhaseEntryEntity>,
  ) {}

  findAllEntries(): Promise<PhaseEntryEntity[]> {
    return this.phaseEntryRepository.find();
  }

  updateEntry(criteria: QueryDeepPartialEntity<PhaseEntryEntity>): Promise<InsertResult> {
    return this.phaseEntryRepository.upsert(criteria, { conflictPaths: ["phase", "teamId"] });
  }

  findById(acronym: string): Promise<PhaseEntity | undefined> {
    return this.phaseRepository.findOne(acronym);
  }

  findAll(): Promise<PhaseEntity[]> {
    return this.phaseRepository.find();
  }
}
