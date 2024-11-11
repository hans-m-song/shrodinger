import { Injectable, Logger } from '@nestjs/common';
import { InjectLogger } from '../../logger';
import { Database, InjectDatabase, playbookRuns } from '../../database';
import { PlaybookRun, PlaybookRunSchema } from '@shrodinger/contracts';
import { eq } from 'drizzle-orm';
import { Result } from '@shrodinger/core/fp';
import { PlaybookRunErrors } from '../playbook-run.errors';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ArgsType, Field, Int } from '@nestjs/graphql';

export type GetPlaybookRunQueryArgs = {
  playbookRunId: PlaybookRun['playbookRunId'];
};

@ArgsType()
export class GetPlaybookRunArgs implements GetPlaybookRunQueryArgs {
  @Field(() => Int)
  declare playbookRunId: number;
}

export class GetPlaybookRunQuery {
  constructor(public readonly args: GetPlaybookRunQueryArgs) {}
}

@Injectable()
@QueryHandler(GetPlaybookRunQuery)
export class GetPlaybookRunHandler
  implements IQueryHandler<GetPlaybookRunQuery>
{
  constructor(
    @InjectLogger(GetPlaybookRunHandler.name)
    private readonly logger: Logger,
    @InjectDatabase()
    private readonly db: Database,
  ) {}

  async execute(query: GetPlaybookRunQuery): Promise<Result<PlaybookRun>> {
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
