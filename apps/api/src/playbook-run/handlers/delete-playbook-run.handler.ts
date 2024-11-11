import { Injectable, Logger } from '@nestjs/common';
import { CommandHandler } from '@nestjs/cqrs';
import { InjectLogger } from '../../logger';
import { Database, InjectDatabase, playbookRuns } from '../../database';
import { eq } from 'drizzle-orm';
import { Result } from '@shrodinger/core/fp';
import { PlaybookRunErrors } from '../playbook-run.errors';
import { ArgsType, Field, Int } from '@nestjs/graphql';
import { PlaybookRun } from '@shrodinger/contracts';

export type DeletePlaybookRunCommandArgs = {
  playbookRunId: PlaybookRun['playbookRunId'];
};

@ArgsType()
export class DeletePlaybookRunArgs implements DeletePlaybookRunCommandArgs {
  @Field(() => Int)
  declare playbookRunId: number;
}

export class DeletePlaybookRunCommand {
  constructor(public readonly args: DeletePlaybookRunCommandArgs) {}
}

@Injectable()
@CommandHandler(DeletePlaybookRunCommand)
export class DeletePlaybookRunHandler {
  constructor(
    @InjectLogger(DeletePlaybookRunHandler.name)
    private readonly logger: Logger,
    @InjectDatabase()
    private readonly db: Database,
  ) {}

  async execute(command: DeletePlaybookRunCommand): Promise<Result<void>> {
    this.logger.debug(command);

    const result = await Result.fromPromise(
      this.db
        .delete(playbookRuns)
        .where(eq(playbookRuns.playbookRunId, command.args.playbookRunId)),
    );

    if (!result.ok) {
      return Result.err(new PlaybookRunErrors.Remove(command, result.error));
    }

    return Result.ok(void null);
  }
}
