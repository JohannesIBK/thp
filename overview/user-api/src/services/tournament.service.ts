import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { TournamentEntity } from "../database/tournament.entity";

@Injectable()
export class TournamentService {
  constructor(@InjectRepository(TournamentEntity) private readonly tournamentRepository: Repository<TournamentEntity>) {}

  findById(id: number): Promise<TournamentEntity | undefined> {
    return this.tournamentRepository.findOne(id);
  }
}
