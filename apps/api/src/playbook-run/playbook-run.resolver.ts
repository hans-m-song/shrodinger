import { InjectLogger, Logger } from '../logger';
import { PlaybookEntity } from '../playbook/playbook.entity';
import { PlaybookService } from '../playbook/playbook.service';
import {
  Args,
  Mutation,
  Parent,
  OmitType,
  Query,
  ResolveField,
  Resolver,
  ArgsType,
} from '@nestjs/graphql';
import { Playbook, PlaybookRun, PlaybookRunLog } from '@shrodinger/contracts';
import { GraphQLError } from 'graphql';
import { PlaybookRunEntity } from './playbook-run.entity';
import { PlaybookRunService } from './playbook-run.service';
import { PlaybookRunLogEntity } from '../playbook-run-log/playbook-run-log.entity';
import { PlaybookRunLogService } from '../playbook-run-log/playbook-run-log.service';
import { CreatePlaybookRunArgs } from './handlers/create-playbook-run.handler';
import { DeletePlaybookRunArgs } from './handlers/delete-playbook-run.handler';
import { ListPlaybookRunsArgs } from './handlers/list-playbook-runs.handler';
import { ListPlaybookRunLogsArgs } from '../playbook-run-log/handlers/list-playbook-run-logs.handler';

@ArgsType()
class ListPlaybookRunLogsArgsWithoutPlaybookRunId extends OmitType(
  ListPlaybookRunLogsArgs,
  ['playbookRunId'],
) {}

@Resolver(() => PlaybookRunEntity)
export class PlaybookRunResolver {
  constructor(
    @InjectLogger(PlaybookRunResolver.name)
    private readonly logger: Logger,
    private readonly playbookService: PlaybookService,
    private readonly playbookRunService: PlaybookRunService,
    private readonly playbookRunLogService: PlaybookRunLogService,
  ) {}

  @Query(() => [PlaybookRunEntity])
  async playbookRuns(
    @Args()
    args: ListPlaybookRunsArgs,
  ): Promise<PlaybookRun[]> {
    const result = await this.playbookRunService.listPlaybookRuns(args);
    if (!result.ok) {
      this.logger.error(result.error);
      throw new GraphQLError(result.error.message, {
        extensions: { code: result.error.name },
      });
    }

    return result.data;
  }

  @ResolveField(() => PlaybookEntity)
  async playbook(
    @Parent()
    { playbookId }: PlaybookRunEntity,
  ): Promise<Playbook> {
    const result = await this.playbookService.getPlaybook({ playbookId });
    if (!result.ok) {
      this.logger.error(result.error);
      throw new GraphQLError(result.error.message, {
        extensions: { code: result.error.name },
      });
    }

    return result.data;
  }

  @ResolveField(() => [PlaybookRunLogEntity])
  async playbookRunLogs(
    @Parent()
    { playbookRunId }: PlaybookRunEntity,
    @Args()
    args: ListPlaybookRunLogsArgsWithoutPlaybookRunId,
  ): Promise<PlaybookRunLog[]> {
    const result = await this.playbookRunLogService.listPlaybookRunLogs({
      ...args,
      playbookRunId,
    });
    if (!result.ok) {
      this.logger.error(result.error);
      throw new GraphQLError(result.error.message, {
        extensions: { code: result.error.name },
      });
    }

    return result.data;
  }

  @Mutation(() => PlaybookRunEntity)
  async createPlaybookRun(
    @Args()
    args: CreatePlaybookRunArgs,
  ): Promise<PlaybookRun> {
    const result = await this.playbookRunService.createPlaybookRun(args);
    if (!result.ok) {
      this.logger.error(result.error);
      throw new GraphQLError(result.error.message, {
        extensions: { code: result.error.name },
      });
    }

    return result.data;
  }

  @Mutation(() => PlaybookRunEntity, { nullable: true })
  async deletePlaybookRun(
    @Args()
    args: DeletePlaybookRunArgs,
  ) {
    const result = await this.playbookRunService.deletePlaybookRun(args);
    if (!result.ok) {
      this.logger.error(result.error);
      throw new GraphQLError(result.error.message, {
        extensions: { code: result.error.name },
      });
    }
  }
}
