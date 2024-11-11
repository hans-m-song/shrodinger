import { Injectable, Logger } from '@nestjs/common';
import { InjectLogger } from '../../logger';
import { Database, InjectDatabase, playbookRuns } from '../../database';
import {
  ListActiveRecords,
  Pagination,
  PlaybookRun,
  PlaybookRunSchema,
  PlaybookRunStatus,
  Range,
} from '@shrodinger/contracts';
import { and, eq, gte, lt } from 'drizzle-orm';
import { Result } from '@shrodinger/core/fp';
import { PlaybookRunErrors } from '../playbook-run.errors';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ArgsType, Field, Int } from '@nestjs/graphql';
import { PaginationArgs, RangeArgs } from '../../dtos/common.args';

export type ListPlaybookRunsQueryArgs = Pagination &
  ListActiveRecords & {
    playbookId?: number;
    status?: PlaybookRunStatus;
    startedAt?: Range;
    completedAt?: Range;
  };

@ArgsType()
export class ListPlaybookRunsArgs
  extends PaginationArgs
  implements ListPlaybookRunsQueryArgs
{
  @Field(() => Int, { nullable: true })
  declare playbookId?: number;

  @Field(() => PlaybookRunStatus, { nullable: true })
  declare status?: PlaybookRunStatus;

  @Field(() => RangeArgs, { nullable: true })
  declare startedAt?: RangeArgs;

  @Field(() => RangeArgs, { nullable: true })
  declare completedAt?: RangeArgs;
}

export class ListPlaybookRunsQuery {
  constructor(public readonly args: ListPlaybookRunsQueryArgs) {}
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
            query.args.createdAt?.from
              ? gte(playbookRuns.createdAt, query.args.createdAt.from)
              : undefined,
            query.args.createdAt?.to
              ? lt(playbookRuns.createdAt, query.args.createdAt.to)
              : undefined,
            query.args.updatedAt?.from
              ? gte(playbookRuns.updatedAt, query.args.updatedAt.from)
              : undefined,
            query.args.updatedAt?.to
              ? lt(playbookRuns.updatedAt, query.args.updatedAt.to)
              : undefined,
            query.args.startedAt?.from
              ? gte(playbookRuns.startedAt, query.args.startedAt.from)
              : undefined,
            query.args.startedAt?.to
              ? gte(playbookRuns.startedAt, query.args.startedAt.to)
              : undefined,
            query.args.completedAt?.from
              ? lt(playbookRuns.completedAt, query.args.completedAt.from)
              : undefined,
            query.args.completedAt?.to
              ? lt(playbookRuns.completedAt, query.args.completedAt.to)
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
