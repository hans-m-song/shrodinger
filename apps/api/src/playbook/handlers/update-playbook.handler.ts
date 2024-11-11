import { Injectable, Logger } from '@nestjs/common';
import { CommandHandler } from '@nestjs/cqrs';
import { InjectLogger } from '../../logger';
import { Database, InjectDatabase, playbooks } from '../../database';
import { Result } from '@shrodinger/core/fp';
import { PlaybookErrors } from '../playbook.errors';
import { Playbook, PlaybookSchema } from '@shrodinger/contracts';
import { ArgsType, Field, Int } from '@nestjs/graphql';
import { eq } from 'drizzle-orm';

export type UpdatePlaybookCommandArgs = {
  playbookId: Playbook['playbookId'];
  active: Playbook['active'];
};

@ArgsType()
export class UpdatePlaybookArgs implements UpdatePlaybookCommandArgs {
  @Field(() => Int)
  declare playbookId: number;

  @Field(() => Boolean)
  declare active: boolean;
}

export class UpdatePlaybookCommand {
  constructor(public readonly args: UpdatePlaybookCommandArgs) {}
}

@Injectable()
@CommandHandler(UpdatePlaybookCommand)
export class UpdatePlaybookCommandHandler {
  constructor(
    @InjectLogger(UpdatePlaybookCommandHandler.name)
    private readonly logger: Logger,
    @InjectDatabase()
    private readonly db: Database,
  ) {}

  async execute(command: UpdatePlaybookCommand): Promise<Result<Playbook>> {
    this.logger.debug(command);

    const result = await Result.fromPromise(
      this.db
        .update(playbooks)
        .set(command.args)
        .where(eq(playbooks.playbookId, command.args.playbookId))
        .returning(),
    );

    if (!result.ok) {
      return Result.err(new PlaybookErrors.Update(command, result.error));
    }

    if (result.data.length < 1) {
      return Result.err(new PlaybookErrors.NotFound(command));
    }

    const parsed = PlaybookSchema.safeParse(result.data[0]);
    if (!parsed.success) {
      return Result.err(
        new PlaybookErrors.Validation(parsed.error, result.data),
      );
    }

    return Result.ok(parsed.data);
  }
}
