import { InjectLogger } from '../../logger';
import { Injectable, Logger } from '@nestjs/common';
import { Database, InjectDatabase, playbookRunLogs } from '../../database';
import {
  Pagination,
  PlaybookRunLog,
  PlaybookRunLogSchema,
  Range,
} from '@shrodinger/contracts';
import { and, asc, eq, gte, lt } from 'drizzle-orm';
import { Result } from '@shrodinger/core/fp';
import { PlaybookRunLogErrors } from '../playbook-run-log.errors';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ArgsType, Field, Int } from '@nestjs/graphql';
import { PaginationArgs, RangeArgs } from '../../dtos/common.args';

export type ListPlaybookRunLogsQueryArgs = Pagination & {
  playbookRunId: number;
  sequence?: Range;
};

@ArgsType()
export class ListPlaybookRunLogsArgs
  extends PaginationArgs
  implements ListPlaybookRunLogsQueryArgs
{
  @Field(() => Int)
  declare playbookRunId: number;

  @Field(() => RangeArgs, { nullable: true })
  declare sequence?: Range;
}

export class ListPlaybookRunLogsQuery {
  constructor(public readonly args: ListPlaybookRunLogsQueryArgs) {}
}

@Injectable()
@QueryHandler(ListPlaybookRunLogsQuery)
export class ListPlaybookRunLogsHandler
  implements IQueryHandler<ListPlaybookRunLogsQuery>
{
  constructor(
    @InjectLogger(ListPlaybookRunLogsHandler.name)
    private readonly logger: Logger,
    @InjectDatabase()
    private readonly db: Database,
  ) {}

  async execute(
    query: ListPlaybookRunLogsQuery,
  ): Promise<Result<PlaybookRunLog[]>> {
    this.logger.debug(query);

    const result = await Result.fromPromise(
      this.db
        .select()
        .from(playbookRunLogs)
        .where(
          and(
            query.args.playbookRunId
              ? eq(playbookRunLogs.playbookRunId, query.args.playbookRunId)
              : undefined,
            query.args.sequence?.from
              ? gte(playbookRunLogs.sequence, query.args.sequence.from)
              : undefined,
            query.args.sequence?.to
              ? lt(playbookRunLogs.sequence, query.args.sequence.to)
              : undefined,
          ),
        )
        .orderBy(asc(playbookRunLogs.sequence))
        .limit(query.args.limit)
        .offset(query.args.offset),
    );

    if (!result.ok) {
      return Result.err(new PlaybookRunLogErrors.List(query, result.error));
    }

    const parsed = PlaybookRunLogSchema.array().safeParse(result.data);
    if (!parsed.success) {
      return Result.err(
        new PlaybookRunLogErrors.Validation(parsed.error, result.data),
      );
    }

    return Result.ok(parsed.data);
  }
}
