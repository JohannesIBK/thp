import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindConditions, Repository, SaveOptions } from "typeorm";
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

  async delete(condition: FindConditions<EntryEntity>): Promise<void> {
    await this.phaseEntryRepository.delete(condition);
  }

  findAll(): Promise<PhaseEntity[]> {
    return this.phaseRepository.find();
  }
}
