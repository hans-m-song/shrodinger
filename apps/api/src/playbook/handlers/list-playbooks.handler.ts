import { Injectable, Logger } from '@nestjs/common';
import { InjectLogger } from '../../logger';
import { Database, InjectDatabase, playbooks } from '../../database';
import {
  ListActiveRecords,
  Pagination,
  Playbook,
  PlaybookSchema,
} from '@shrodinger/contracts';
import { and, eq, gte, lt } from 'drizzle-orm';
import { Result } from '@shrodinger/core/fp';
import { PlaybookErrors } from '../playbook.errors';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ArgsType, Field } from '@nestjs/graphql';
import { ListActiveRecordEntityArgs } from '../../dtos/common.args';

export type ListPlaybooksQueryArgs = Pagination &
  ListActiveRecords & {
    active?: Playbook['active'];
    filepath?: Playbook['filepath'];
  };

@ArgsType()
export class ListPlaybooksArgs
  extends ListActiveRecordEntityArgs
  implements ListPlaybooksQueryArgs
{
  @Field(() => Boolean, { nullable: true })
  active?: boolean;

  @Field(() => String, { nullable: true })
  filepath?: string;
}

export class ListPlaybooksQuery {
  constructor(public readonly args: ListPlaybooksQueryArgs) {}
}

@Injectable()
@QueryHandler(ListPlaybooksQuery)
export class ListPlaybooksQueryHandler
  implements IQueryHandler<ListPlaybooksQuery>
{
  constructor(
    @InjectLogger(ListPlaybooksQueryHandler.name)
    private readonly logger: Logger,
    @InjectDatabase()
    private readonly db: Database,
  ) {}

  async execute(query: ListPlaybooksQuery): Promise<Result<Playbook[]>> {
    this.logger.debug(query);

    const result = await Result.fromPromise(
      this.db
        .select()
        .from(playbooks)
        .where(
          and(
            query.args.active
              ? eq(playbooks.active, query.args.active)
              : undefined,
            query.args.filepath
              ? eq(playbooks.filepath, query.args.filepath)
              : undefined,
            query.args.createdAt?.from
              ? gte(playbooks.createdAt, query.args.createdAt.from)
              : undefined,
            query.args.createdAt?.to
              ? lt(playbooks.createdAt, query.args.createdAt.to)
              : undefined,
            query.args.updatedAt?.from
              ? gte(playbooks.updatedAt, query.args.updatedAt.from)
              : undefined,
            query.args.updatedAt?.to
              ? lt(playbooks.updatedAt, query.args.updatedAt.to)
              : undefined,
          ),
        )
        .limit(query.args.limit)
        .offset(query.args.offset),
    );

    if (!result.ok) {
      return Result.err(new PlaybookErrors.List(query, result.error));
    }

    const parsed = PlaybookSchema.array().safeParse(result.data);
    if (!parsed.success) {
      return Result.err(
        new PlaybookErrors.Validation(parsed.error, result.data),
      );
    }

    return Result.ok(parsed.data);
  }
}
