import { Injectable, Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PlaybookRunLog, PlaybookRunLogSchema } from '@shrodinger/contracts';
import { InjectLogger } from '../../logger';
import { InjectDatabase, Database, playbookRunLogs } from '../../database';
import { Result } from '@shrodinger/core/fp';
import { PlaybookRunLogErrors } from '../playbook-run-log.errors';

export type CreatePlaybookRunLogCommandArgs = PlaybookRunLog;

export class CreatePlaybookRunLogCommand {
  constructor(public readonly args: CreatePlaybookRunLogCommandArgs) {}
}

@Injectable()
@CommandHandler(CreatePlaybookRunLogCommand)
export class CreatePlaybookRunLogHandler
  implements ICommandHandler<CreatePlaybookRunLogCommand>
{
  constructor(
    @InjectLogger(CreatePlaybookRunLogHandler.name)
    private readonly logger: Logger,
    @InjectDatabase()
    private readonly db: Database,
  ) {}

  async execute(
    command: CreatePlaybookRunLogCommand,
  ): Promise<Result<PlaybookRunLog>> {
    this.logger.debug(command);

    const result = await Result.fromPromise(
      this.db.insert(playbookRunLogs).values(command.args).returning(),
    );

    if (!result.ok) {
      return Result.err(new PlaybookRunLogErrors.Create(command, result.error));
    }

    if (result.data.length < 1) {
      return Result.err(new PlaybookRunLogErrors.NotFound(command));
    }

    const parsed = PlaybookRunLogSchema.safeParse(result.data[0]);
    if (!parsed.success) {
      return Result.err(
        new PlaybookRunLogErrors.Validation(parsed.error, result.data),
      );
    }

    return Result.ok(parsed.data);
  }
}
