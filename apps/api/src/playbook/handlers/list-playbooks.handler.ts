import { Injectable, Logger } from '@nestjs/common';
import { InjectLogger } from '../../logger';
import { Database, InjectDatabase, playbooks } from '../../database';
import {
  ListPlaybooksAttributes,
  Playbook,
  PlaybookSchema,
} from '@shrodinger/contracts';
import { eq } from 'drizzle-orm';
import { Result } from '@shrodinger/core/fp';
import { PlaybookErrors } from '../playbook.errors';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ArgsType, Field, Int } from '@nestjs/graphql';
import { PaginationArgs } from '../../dtos/pagination.args';

@ArgsType()
export class ListPlaybooksArgs
  extends PaginationArgs
  implements ListPlaybooksAttributes
{
  @Field(() => Int, { nullable: true })
  playbookId?: number;

  @Field(() => String, { nullable: true })
  filepath?: string;
}

export class ListPlaybooksQuery {
  constructor(public readonly args: ListPlaybooksAttributes) {}
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
          query.args.filepath
            ? eq(playbooks.filepath, query.args.filepath)
            : undefined,
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
