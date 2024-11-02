import { Injectable, Logger } from '@nestjs/common';
import { CommandHandler } from '@nestjs/cqrs';
import { InjectLogger } from '../../logger';
import { Database, InjectDatabase, playbooks } from '../../database';
import { Result } from '@shrodinger/core/fp';
import { PlaybookErrors } from '../playbook.errors';
import {
  Playbook,
  PlaybookSchema,
  UpdatePlaybookAttributes,
} from '@shrodinger/contracts';
import { ArgsType, Field, Int } from '@nestjs/graphql';
import { GraphQLJSON } from 'graphql-scalars';
import { eq } from 'drizzle-orm';

@ArgsType()
export class UpdatePlaybookArgs implements UpdatePlaybookAttributes {
  @Field(() => Int)
  declare playbookId: number;

  @Field(() => String, { nullable: true })
  declare filepath?: string;

  @Field(() => GraphQLJSON, { nullable: true })
  declare contents?: Record<string, unknown>;
}

export class UpdatePlaybookCommand {
  constructor(public readonly args: UpdatePlaybookAttributes) {}
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
