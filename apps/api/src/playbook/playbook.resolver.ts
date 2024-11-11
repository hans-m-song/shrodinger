import {
  Args,
  ArgsType,
  Mutation,
  OmitType,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { Playbook, PlaybookRun } from '@shrodinger/contracts';
import { GraphQLError } from 'graphql';
import { InjectLogger, Logger } from '../logger';
import { PlaybookRunEntity } from '../playbook-run/playbook-run.entity';
import { PlaybookRunService } from '../playbook-run/playbook-run.service';
import { PlaybookEntity } from './playbook.entity';
import { PlaybookService } from './playbook.service';
import { ListPlaybooksArgs } from './handlers/list-playbooks.handler';
import { UpdatePlaybookArgs } from './handlers/update-playbook.handler';
import { ListPlaybookRunsArgs } from '../playbook-run/handlers/list-playbook-runs.handler';

@ArgsType()
class ListPlaybookRunsArgsWithoutRunbookId extends OmitType(
  ListPlaybookRunsArgs,
  ['playbookId'],
) {}

@Resolver(() => PlaybookEntity)
export class PlaybookResolver {
  constructor(
    @InjectLogger(PlaybookResolver.name)
    private readonly logger: Logger,
    private readonly playbookService: PlaybookService,
    private readonly playbookRunService: PlaybookRunService,
  ) {}

  @Query(() => [PlaybookEntity])
  async playbooks(
    @Args()
    args: ListPlaybooksArgs,
  ): Promise<Playbook[]> {
    const result = await this.playbookService.listPlaybooks(args);

    if (!result.ok) {
      this.logger.error(result.error);
      throw new GraphQLError(result.error.message, {
        extensions: { code: result.error.name },
      });
    }

    return result.data;
  }

  @ResolveField(() => [PlaybookRunEntity])
  async playbookRuns(
    @Parent()
    { playbookId }: PlaybookEntity,
    @Args()
    args: ListPlaybookRunsArgsWithoutRunbookId,
  ): Promise<PlaybookRun[]> {
    const result = await this.playbookRunService.listPlaybookRuns({
      ...args,
      playbookId,
    });

    if (!result.ok) {
      this.logger.error(result.error);
      throw new GraphQLError(result.error.message, {
        extensions: { code: result.error.name },
      });
    }

    return result.data;
  }

  @Mutation(() => PlaybookEntity)
  async updatePlaybook(
    @Args()
    args: UpdatePlaybookArgs,
  ): Promise<Playbook> {
    const result = await this.playbookService.updatePlaybook(args);
    if (!result.ok) {
      this.logger.error(result.error);
      throw new GraphQLError(result.error.message, {
        extensions: { code: result.error.name },
      });
    }

    return result.data;
  }
}
