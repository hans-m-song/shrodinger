import { Injectable, Logger } from '@nestjs/common';
import { CommandHandler } from '@nestjs/cqrs';
import { InjectLogger } from '../../logger';
import { Database, InjectDatabase, playbookRuns } from '../../database';
import { Result } from '@shrodinger/core/fp';
import { PlaybookRunErrors } from '../playbook-run.errors';
import {
  PlaybookRun,
  PlaybookRunSchema,
  UpdatePlaybookRunAttributes,
} from '@shrodinger/contracts';

export class UpdatePlaybookRunCommand {
  constructor(public readonly args: UpdatePlaybookRunAttributes) {}
}

@Injectable()
@CommandHandler(UpdatePlaybookRunCommand)
export class UpdatePlaybookRunHandler {
  constructor(
    @InjectLogger(UpdatePlaybookRunHandler.name)
    private readonly logger: Logger,
    @InjectDatabase()
    private readonly db: Database,
  ) {}

  async execute(
    command: UpdatePlaybookRunCommand,
  ): Promise<Result<PlaybookRun>> {
    this.logger.debug(command);

    const result = await Result.fromPromise(
      this.db.update(playbookRuns).set(command.args).returning(),
    );

    if (!result.ok) {
      return Result.err(new PlaybookRunErrors.Update(command, result.error));
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
