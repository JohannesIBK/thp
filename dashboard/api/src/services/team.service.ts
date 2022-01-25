import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindManyOptions, FindOneOptions, Repository } from "typeorm";
import { PlayerEntity } from "../database/player.entity";
import { TeamEntity } from "../database/team.entity";

@Injectable()
export class TeamService {
  constructor(
    @InjectRepository(TeamEntity) private readonly teamRepository: Repository<TeamEntity>,
    @InjectRepository(PlayerEntity) private readonly playerRepository: Repository<PlayerEntity>,
  ) {}

  find(options?: FindManyOptions<TeamEntity>): Promise<TeamEntity[]> {
    return this.teamRepository.find(options);
  }

  findOne(options?: FindOneOptions<TeamEntity>): Promise<TeamEntity | undefined> {
    return this.teamRepository.findOne(options);
  }

  async createTeamWithPlayers(uuids: string[]): Promise<TeamEntity> {
    const team = await this.teamRepository.save({});
    await this.playerRepository.update(uuids, { team });

    return team;
  }

  async deleteTeam(teamId: number): Promise<void> {
    await this.teamRepository.delete(teamId);
    await this.playerRepository.update({ team: new TeamEntity({ id: teamId }) }, { team: null });
  }

  async deleteAll(): Promise<void> {
    await this.teamRepository.delete({});
    await this.playerRepository.delete({});
  }

  async removePlayer(teamId: number): Promise<void> {
    const result = await this.playerRepository.find({ where: { team: { id: teamId } } });

    if (result.length === 0) {
      await this.deleteTeam(teamId);
    }
  }

  save(entity: TeamEntity): Promise<TeamEntity> {
    return this.teamRepository.save(entity);
  }
}
