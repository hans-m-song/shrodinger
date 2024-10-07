import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { err, ok, Result, safe } from '@shrodinger/core/fp';
import { Playbook, PlaybookSchema } from '@shrodinger/contracts';
import { Op } from 'sequelize';
import { PlaybookErrors } from './playbook.errors';
import {
  PlaybookCreationAttributes,
  PlaybookModel,
} from '../database/models/playbook.model';

@Injectable()
export class PlaybookService {
  constructor(
    @InjectModel(PlaybookModel) private playbookModel: typeof PlaybookModel,
  ) {}

  async list(search?: {
    filepath?: string;
    offset?: number;
    limit?: number;
  }): Promise<Result<Playbook[]>> {
    const result = await safe(this.playbookModel.findAll)({
      where: {
        ...(search?.filepath && {
          filepath: { [Op.like]: `%${search.filepath}%` },
        }),
      },
      limit: search?.limit,
      offset: search?.offset ?? 0,
    });
    if (!result.ok) {
      return err(new PlaybookErrors.List({ search }, result.error));
    }

    if (!result.data) {
      return err(new PlaybookErrors.NotFound({ search }));
    }

    const parsed = PlaybookSchema.array().safeParse(result.data);
    if (!parsed.success) {
      return err(new PlaybookErrors.Validation(parsed.error, result.data));
    }

    return ok(parsed.data);
  }

  async get(playbookId: number): Promise<Result<Playbook>> {
    const result = await safe(this.playbookModel.findOne)({
      where: { playbookId },
    });
    if (!result.ok) {
      return err(new PlaybookErrors.NotFound({ playbookId }, result.error));
    }

    if (!result.data) {
      return err(new PlaybookErrors.NotFound({ playbookId }));
    }

    const parsed = PlaybookSchema.safeParse(result.data);
    if (!parsed.success) {
      return err(new PlaybookErrors.Validation(parsed.error, result.data));
    }

    return ok(parsed.data);
  }

  async remove(playbookId: number): Promise<Result<void>> {
    const result = await safe(this.playbookModel.destroy)({
      where: { playbookId },
    });
    if (!result.ok) {
      return err(new PlaybookErrors.Remove({ playbookId }, result.error));
    }

    return ok(void null);
  }

  async create(
    playbook: PlaybookCreationAttributes,
  ): Promise<Result<Playbook>> {
    const result = await safe(this.playbookModel.create)(playbook);
    if (!result.ok) {
      return err(new PlaybookErrors.Create(playbook, result.error));
    }

    if (!result.data) {
      return err(new PlaybookErrors.NotFound(playbook));
    }

    const parsed = PlaybookSchema.safeParse(result.data);
    if (!parsed.success) {
      return err(new PlaybookErrors.Validation(parsed.error, result.data));
    }

    return ok(parsed.data);
  }

  async update(
    playbook: PlaybookCreationAttributes,
  ): Promise<Result<Playbook>> {
    const result = await safe(this.playbookModel.build(playbook).save)();
    if (!result.ok) {
      return err(new PlaybookErrors.Update(playbook, result.error));
    }

    if (!result.data) {
      return err(new PlaybookErrors.NotFound(playbook));
    }

    const parsed = PlaybookSchema.safeParse(result.data);
    if (!parsed.success) {
      return err(new PlaybookErrors.Validation(parsed.error, result.data));
    }

    return ok(parsed.data);
  }
}
