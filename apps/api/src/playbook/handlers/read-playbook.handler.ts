import { Injectable, Logger } from '@nestjs/common';
import { InjectLogger } from '../../logger';
import { Database, InjectDatabase, playbooks } from '../../database';
import { Playbook, PlaybookSchema } from '@shrodinger/contracts';
import { eq } from 'drizzle-orm';
import { Result } from '@shrodinger/core/fp';
import { PlaybookErrors } from '../playbook.errors';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

export class ReadPlaybookQuery {
  constructor(public readonly args: { playbookId: number }) {}
}

@Injectable()
@QueryHandler(ReadPlaybookQuery)
export class ReadPlaybookQueryHandler
  implements IQueryHandler<ReadPlaybookQuery>
{
  constructor(
    @InjectLogger(ReadPlaybookQueryHandler.name)
    private readonly logger: Logger,
    @InjectDatabase()
    private readonly db: Database,
  ) {}

  async execute(query: ReadPlaybookQuery): Promise<Result<Playbook>> {
    this.logger.debug(query);

    const result = await Result.fromPromise(
      this.db
        .select()
        .from(playbooks)
        .where(eq(playbooks.playbookId, query.args.playbookId)),
    );

    if (!result.ok) {
      return Result.err(new PlaybookErrors.NotFound(query, result.error));
    }

    if (result.data.length < 1) {
      return Result.err(new PlaybookErrors.NotFound(query));
    }

    const parsed = PlaybookSchema.safeParse(result.data[0]);
    if (!parsed.success) {
      return Result.err(
        new PlaybookErrors.Validation(parsed.error, result.data),
      );
    }

    return Result.ok(parsed.data);
  }
}
