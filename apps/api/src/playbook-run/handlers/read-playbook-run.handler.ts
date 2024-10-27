import { Injectable, Logger } from '@nestjs/common';
import { InjectLogger } from '../../logger';
import { Database, InjectDatabase, playbookRuns } from '../../database';
import { PlaybookRun, PlaybookRunSchema } from '@shrodinger/contracts';
import { eq } from 'drizzle-orm';
import { Result } from '@shrodinger/core/fp';
import { PlaybookRunErrors } from '../playbook-run.errors';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

export class ReadPlaybookRunQuery {
  constructor(public readonly args: { playbookRunId: number }) {}
}

@Injectable()
@QueryHandler(ReadPlaybookRunQuery)
export class ReadPlaybookRunHandler
  implements IQueryHandler<ReadPlaybookRunQuery>
{
  constructor(
    @InjectLogger(ReadPlaybookRunHandler.name)
    private readonly logger: Logger,
    @InjectDatabase()
    private readonly db: Database,
  ) {}

  async execute(query: ReadPlaybookRunQuery): Promise<Result<PlaybookRun>> {
    this.logger.debug(query);

    const result = await Result.fromPromise(
      this.db
        .select()
        .from(playbookRuns)
        .where(eq(playbookRuns.playbookRunId, query.args.playbookRunId)),
    );

    if (!result.ok) {
      return Result.err(new PlaybookRunErrors.NotFound(query, result.error));
    }

    if (result.data.length < 1) {
      return Result.err(new PlaybookRunErrors.NotFound(query));
    }

    const parsed = PlaybookRunSchema.safeParse(result.data[0]);
    if (!parsed.success) {
      return Result.err(
        new PlaybookRunErrors.Validation(parsed.error, result.data),
      );
    }

    return Result.ok(parsed.data);
  }
}
