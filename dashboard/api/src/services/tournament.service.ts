import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { TournamentEntity } from "../database/tournament.entity";
import { IOptionalTournament } from "../types/tournament.interface";

@Injectable()
export class TournamentService {
  constructor(@InjectRepository(TournamentEntity) private readonly tournamentRepository: Repository<TournamentEntity>) {}

  create(tournament: TournamentEntity): Promise<TournamentEntity> {
    return this.tournamentRepository.save(tournament);
  }

  findOne(): Promise<TournamentEntity | undefined> {
    return this.tournamentRepository.findOne({ relations: ["phases"] });
  }

  async update(update: IOptionalTournament): Promise<void> {
    await this.tournamentRepository.update({}, update);
  }

  async deleteTournament(): Promise<void> {
    await this.tournamentRepository.delete({});
  }
}
