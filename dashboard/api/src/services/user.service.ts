import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindConditions, FindOneOptions, Repository, UpdateResult } from "typeorm";
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity";
import { UserEntity } from "../database/user.entity";

@Injectable()
export class UserService {
  constructor(@InjectRepository(UserEntity) private readonly usersRepository: Repository<UserEntity>) {}

  /**
   * Fetches a user by their from the database.
   * @param {string} id The id of the user
   * @returns {Promise<User|null>}
   */
  findById(id: number): Promise<UserEntity | undefined> {
    return this.usersRepository.findOne(id);
  }

  /**
   * Fetches a user from the database.
   * @param {string} username The username of the user
   * @returns {Promise<User|null>}
   */
  findByUsername(username: string): Promise<UserEntity | undefined> {
    return this.usersRepository.findOne({ where: { username } });
  }

  /**
   * Fetches a user from the database.
   * @param {FindOneOptions<UserEntity>} query The query for searching
   * @returns {Promise<User|null>}
   */
  findOne(query: FindOneOptions<UserEntity>): Promise<UserEntity | undefined> {
    return this.usersRepository.findOne(query);
  }

  find(query: FindOneOptions<UserEntity>): Promise<UserEntity[]> {
    return this.usersRepository.find(query);
  }

  /**
   * Saves or updates a user with the given data.
   * @param {User} user The user data
   * @returns {Promise<User>}
   */
  save(user: UserEntity): Promise<UserEntity> {
    return this.usersRepository.save(user);
  }

  /**
   * Updates a user in the database.
   * @param {FindConditions<UserEntity>} criteria Criteria to find the user
   * @param {QueryDeepPartialEntity<UserEntity>} user Data to update the user with
   * @return {Promise<UpdateResult>}
   */
  update(criteria: FindConditions<UserEntity> | number, user: QueryDeepPartialEntity<UserEntity>): Promise<UpdateResult> {
    return this.usersRepository.update(criteria, user);
  }

  /**
   * Deletes a user from the database.
   * @param {string} id The user id
   * @returns {Promise<boolean>} Whether the user has been deleted.
   */
  async delete(id: number): Promise<boolean> {
    return !!(await this.usersRepository.delete(id)).affected;
  }
}
