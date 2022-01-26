import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { PhaseEntity } from "../database/phase.entity";

@Injectable()
export class PhaseService {
  constructor(@InjectRepository(PhaseEntity) private readonly phaseRepository: Repository<PhaseEntity>) {}

  findAll(): Promise<PhaseEntity[]> {
    return this.phaseRepository.find();
  }
}
