import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { IPlaybook, Playbook } from './playbook.model';

interface Pagination {
  skip: number;
  take: number;
}

@Injectable()
export class PlaybookService {
  constructor(@InjectModel(Playbook) private playbookModel: typeof Playbook) {}

  async list(page?: Partial<Pagination>): Promise<Playbook[]> {
    return this.playbookModel.findAll({
      limit: Math.min(50, page?.take ?? 10),
      offset: page?.skip ?? 0,
    });
  }

  async get(id: string): Promise<Playbook> {
    return this.playbookModel.findOne({ where: { id } });
  }

  async remove(id: string) {
    await this.playbookModel.destroy({ where: { id } });
  }

  async create(playbook: IPlaybook): Promise<Playbook> {
    return this.playbookModel.create(playbook);
  }

  async update(playbook: IPlaybook): Promise<Playbook> {
    return this.playbookModel
      .build({ updatedAt: Date.now(), ...playbook })
      .save();
  }
}
