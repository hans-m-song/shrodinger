import { Injectable, Logger } from '@nestjs/common';
import { CommandHandler } from '@nestjs/cqrs';
import { InjectLogger } from '../../logger';
import { Database, InjectDatabase, playbooks } from '../../database';
import { Result } from '@shrodinger/core/fp';
import { PlaybookErrors } from '../playbook.errors';
import { Playbook, PlaybookSchema } from '@shrodinger/contracts';
import { ArgsType, Field } from '@nestjs/graphql';

export type CreatePlaybookCommandArgs = {
  filepath: Playbook['filepath'];
};

@ArgsType()
export class CreatePlaybookArgs implements CreatePlaybookCommandArgs {
  @Field(() => String)
  declare filepath: string;
}

export class CreatePlaybookCommand {
  constructor(public readonly args: CreatePlaybookCommandArgs) {}
}

@Injectable()
@CommandHandler(CreatePlaybookCommand)
export class CreatePlaybookCommandHandler {
  constructor(
    @InjectLogger(CreatePlaybookCommandHandler.name)
    private readonly logger: Logger,
    @InjectDatabase()
    private readonly db: Database,
  ) {}

  async execute(command: CreatePlaybookCommand): Promise<Result<Playbook>> {
    this.logger.debug(command);

    const result = await Result.fromPromise(
      this.db.insert(playbooks).values(command.args).returning(),
    );

    if (!result.ok) {
      return Result.err(new PlaybookErrors.Create(command, result.error));
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
