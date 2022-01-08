import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { PlayerEntity } from "../database/player.entity";
import { TeamEntity } from "../database/team.entity";

@Injectable()
export class TeamService {
  constructor(
    @InjectRepository(TeamEntity) private readonly teamRepository: Repository<TeamEntity>,
    @InjectRepository(PlayerEntity) private readonly playerRepository: Repository<PlayerEntity>,
  ) {}

  findAll(): Promise<TeamEntity[]> {
    return this.teamRepository.find();
  }

  async createTeamWithPlayers(uuids: string[]): Promise<TeamEntity> {
    const team = await this.teamRepository.save({ members: uuids.length });
    await this.playerRepository.update(uuids, { team: team.id });

    return team;
  }

  async deleteTeam(teamId: number): Promise<void> {
    await this.teamRepository.delete(teamId);
    await this.playerRepository.update({ team: teamId }, { team: undefined });
  }

  async deleteAll(): Promise<void> {
    await this.teamRepository.delete({});
    await this.playerRepository.delete({});
  }

  async removePlayer(teamId: number): Promise<void> {
    const result = await this.teamRepository
      .createQueryBuilder()
      .update()
      .set({ members: () => "members - 1" })
      .whereInIds(teamId)
      .returning(["members"])
      .execute();

    if (result.raw[0]?.members || 0 <= 0) await this.deleteTeam(teamId);
  }

  save(entity: TeamEntity): Promise<TeamEntity> {
    return this.teamRepository.save(entity);
  }
}
