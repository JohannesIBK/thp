import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindConditions, InsertResult, Repository, SaveOptions } from "typeorm";
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity";
import { EntryEntity } from "../database/entry.entity";
import { PhaseEntity } from "../database/phase.entity";

@Injectable()
export class PhaseService {
  constructor(
    @InjectRepository(PhaseEntity) private readonly phaseRepository: Repository<PhaseEntity>,
    @InjectRepository(EntryEntity) private readonly phaseEntryRepository: Repository<EntryEntity>,
  ) {}

  save(phase: PhaseEntity): Promise<PhaseEntity | PhaseEntity[]> {
    return this.phaseRepository.save(phase);
  }

  async create(phases: PhaseEntity[]): Promise<void> {
    await this.phaseRepository.insert(phases);
  }

  findAllEntries(): Promise<EntryEntity[]> {
    return this.phaseEntryRepository.find();
  }

  saveEntry(entity: EntryEntity, options?: SaveOptions): Promise<EntryEntity> {
    return this.phaseEntryRepository.save(entity, options);
  }

  updateEntry(criteria: QueryDeepPartialEntity<EntryEntity>): Promise<InsertResult> {
    return this.phaseEntryRepository.upsert(criteria, { conflictPaths: ["phase", "teamId"] });
  }

  async delete(condition: FindConditions<EntryEntity>): Promise<void> {
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
