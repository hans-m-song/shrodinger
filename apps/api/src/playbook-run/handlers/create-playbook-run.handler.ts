import { Injectable, Logger } from '@nestjs/common';
import { CommandHandler } from '@nestjs/cqrs';
import { InjectLogger } from '../../logger';
import { Database, InjectDatabase, playbookRuns } from '../../database';
import { Result } from '@shrodinger/core/fp';
import { PlaybookRunErrors } from '../playbook-run.errors';
import { PlaybookRun, PlaybookRunSchema } from '@shrodinger/contracts';
import { ArgsType, Field, Int } from '@nestjs/graphql';

export type CreatePlaybookRunCommandArgs = {
  playbookId: PlaybookRun['playbookId'];
  playbookVersion: PlaybookRun['playbookVersion'];
};

@ArgsType()
export class CreatePlaybookRunArgs implements CreatePlaybookRunCommandArgs {
  @Field(() => Int)
  declare playbookId: number;

  @Field(() => Int)
  declare playbookVersion: number;
}

export class CreatePlaybookRunCommand {
  constructor(public readonly args: CreatePlaybookRunCommandArgs) {}
}

@Injectable()
@CommandHandler(CreatePlaybookRunCommand)
export class CreatePlaybookRunHandler {
  constructor(
    @InjectLogger(CreatePlaybookRunHandler.name)
    private readonly logger: Logger,
    @InjectDatabase()
    private readonly db: Database,
  ) {}

  async execute(
    command: CreatePlaybookRunCommand,
  ): Promise<Result<PlaybookRun>> {
    this.logger.debug(command);

    const result = await Result.fromPromise(
      this.db.insert(playbookRuns).values(command.args).returning(),
    );

    if (!result.ok) {
      return Result.err(new PlaybookRunErrors.Create(command, result.error));
    }

    if (result.data.length < 1) {
      return Result.err(new PlaybookRunErrors.NotFound(command));
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
