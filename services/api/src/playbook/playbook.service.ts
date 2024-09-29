import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Playbook, PlaybookCreationAttributes } from './playbook.model';
import { WhereOptions } from 'sequelize';

@Injectable()
export class PlaybookService {
  constructor(@InjectModel(Playbook) private playbookModel: typeof Playbook) {}

  async list(search?: {
    playbookId?: number;
    offset?: number;
    limit?: number;
  }): Promise<Playbook[]> {
    const where: WhereOptions = {};

    if (search?.playbookId) {
      where.playbookId = search.playbookId;
    }

    return this.playbookModel.findAll({
      where,
      limit: search?.limit,
      offset: search?.offset ?? 0,
    });
  }

  async get(playbookId: number): Promise<Playbook> {
    return this.playbookModel.findOne({ where: { playbookId } });
  }

  async remove(playbookId: number) {
    await this.playbookModel.destroy({ where: { playbookId } });
  }

  async create(playbook: PlaybookCreationAttributes): Promise<Playbook> {
    return this.playbookModel.create(playbook);
  }

  async update(playbook: PlaybookCreationAttributes): Promise<Playbook> {
    return this.playbookModel.build(playbook).save();
  }
}
