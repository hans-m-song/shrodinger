import { Injectable, Logger } from '@nestjs/common';
import { CommandHandler } from '@nestjs/cqrs';
import { InjectLogger } from '../../logger';
import { Database, InjectDatabase, playbooks } from '../../database';
import { eq } from 'drizzle-orm';
import { Result } from '@shrodinger/core/fp';
import { PlaybookErrors } from '../playbook.errors';
import { ArgsType, Field, Int } from '@nestjs/graphql';

@ArgsType()
export class DeletePlaybookArgs {
  @Field(() => Int)
  declare playbookId: number;
}

export class DeletePlaybookCommand {
  constructor(public readonly args: { playbookId: number }) {}
}

@Injectable()
@CommandHandler(DeletePlaybookCommand)
export class DeletePlaybookCommandHandler {
  constructor(
    @InjectLogger(DeletePlaybookCommandHandler.name)
    private readonly logger: Logger,
    @InjectDatabase()
    private readonly db: Database,
  ) {}

  async execute(command: DeletePlaybookCommand): Promise<Result<void>> {
    this.logger.debug(command);

    const result = await Result.fromPromise(
      this.db
        .delete(playbooks)
        .where(eq(playbooks.playbookId, command.args.playbookId)),
    );

    if (!result.ok) {
      return Result.err(new PlaybookErrors.Remove(command, result.error));
    }

    return Result.ok(void null);
  }
}
