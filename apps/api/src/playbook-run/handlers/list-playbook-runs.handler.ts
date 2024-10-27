import { Injectable, Logger } from '@nestjs/common';
import { InjectLogger } from '../../logger';
import { Database, InjectDatabase, playbookRuns } from '../../database';
import {
  ListPlaybookRunsAttributes,
  PlaybookRun,
  PlaybookRunSchema,
} from '@shrodinger/contracts';
import { and, eq } from 'drizzle-orm';
import { Result } from '@shrodinger/core/fp';
import { PlaybookRunErrors } from '../playbook-run.errors';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

export class ListPlaybookRunsQuery {
  constructor(public readonly args: ListPlaybookRunsAttributes) {}
}

@Injectable()
@QueryHandler(ListPlaybookRunsQuery)
export class ListPlaybookRunsHandler
  implements IQueryHandler<ListPlaybookRunsQuery>
{
  constructor(
    @InjectLogger(ListPlaybookRunsHandler.name)
    private readonly logger: Logger,
    @InjectDatabase()
    private readonly db: Database,
  ) {}

  async execute(query: ListPlaybookRunsQuery): Promise<Result<PlaybookRun[]>> {
    this.logger.debug(query);

    const result = await Result.fromPromise(
      this.db
        .select()
        .from(playbookRuns)
        .where(
          and(
            query.args.playbookId
              ? eq(playbookRuns.playbookId, query.args.playbookId)
              : undefined,
            query.args.status
              ? eq(playbookRuns.status, query.args.status)
              : undefined,
          ),
        )
        .limit(query.args.limit)
        .offset(query.args.offset),
    );

    if (!result.ok) {
      return Result.err(new PlaybookRunErrors.List(query, result.error));
    }

    const parsed = PlaybookRunSchema.array().safeParse(result.data);
    if (!parsed.success) {
      return Result.err(
        new PlaybookRunErrors.Validation(parsed.error, result.data),
      );
    }

    return Result.ok(parsed.data);
  }
}
