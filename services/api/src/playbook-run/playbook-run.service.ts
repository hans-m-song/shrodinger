import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import {
  PlaybookRunCreationAttributes,
  PlaybookRun,
} from './playbook-run.model';
import { WhereOptions } from 'sequelize';

@Injectable()
export class PlaybookRunService {
  constructor(
    @InjectModel(PlaybookRun) private playbookRunModel: typeof PlaybookRun,
  ) {}

  async list(search: {
    playbookId?: number;
    playbookRunId?: number;
    offset?: number;
    limit?: number;
  }): Promise<PlaybookRun[]> {
    const where: WhereOptions = {};

    if (search?.playbookId) {
      where.playbookId = search.playbookId;
    }

    if (search?.playbookRunId) {
      where.playbookRunId = search.playbookRunId;
    }

    return this.playbookRunModel.findAll({
      where,
      limit: search?.limit,
      offset: search?.offset ?? 0,
    });
  }

  async get(playbookRunId: number): Promise<PlaybookRun> {
    return this.playbookRunModel.findOne({ where: { playbookRunId } });
  }

  async remove(playbookRunId: number) {
    await this.playbookRunModel.destroy({ where: { playbookRunId } });
  }

  async create(
    playbookRun: PlaybookRunCreationAttributes,
  ): Promise<PlaybookRun> {
    return this.playbookRunModel.create(playbookRun);
  }

  async update(
    playbookRun: PlaybookRunCreationAttributes,
  ): Promise<PlaybookRun> {
    return this.playbookRunModel.build(playbookRun).save();
  }
}
