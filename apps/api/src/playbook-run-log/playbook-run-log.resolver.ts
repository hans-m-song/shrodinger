import { PlaybookRun, PlaybookRunLog } from '@shrodinger/contracts';
import { InjectLogger, Logger } from '../logger';
import { PlaybookRunService } from '../playbook-run/playbook-run.service';
import { PlaybookRunLogEntity } from './playbook-run-log.entity';
import { Args, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { PlaybookRunLogService } from './playbook-run-log.service';
import { PlaybookRunEntity } from '../playbook-run/playbook-run.entity';
import { GraphQLError } from 'graphql';
import { ListPlaybookRunLogsArgs } from './handlers/list-playbook-run-logs.handler';

@Resolver(() => PlaybookRunLogEntity)
export class PlaybookRunLogResolver {
  constructor(
    @InjectLogger(PlaybookRunLogResolver.name)
    private readonly logger: Logger,
    private readonly playbookRunService: PlaybookRunService,
    private readonly playbookRunLogService: PlaybookRunLogService,
  ) {}

  @Query(() => [PlaybookRunLogEntity])
  async playbookRunLogs(
    @Args()
    args: ListPlaybookRunLogsArgs,
  ): Promise<PlaybookRunLog[]> {
    const result = await this.playbookRunLogService.listPlaybookRunLogs(args);
    if (!result.ok) {
      this.logger.error(result.error);
      throw new GraphQLError(result.error.message, {
        extensions: { code: result.error.name },
      });
    }

    return result.data;
  }

  @ResolveField(() => PlaybookRunEntity)
  async playbookRun(
    @Parent()
    { playbookRunId }: PlaybookRunLogEntity,
  ): Promise<PlaybookRun> {
    const result = await this.playbookRunService.getPlaybookRun({
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
}
