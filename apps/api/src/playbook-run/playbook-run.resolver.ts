import { InjectLogger, Logger } from '../logger';
import { PlaybookEntity } from '../playbook/playbook.entity';
import { PlaybookService } from '../playbook/playbook.service';
import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { Playbook, PlaybookRun } from '@shrodinger/contracts';
import { GraphQLError } from 'graphql';
import {
  CreatePlaybookRunArgs,
  DeletePlaybookRunArgs,
  ListPlaybookRunsArgs,
  UpdatePlaybookRunArgs,
} from './playbook-run.args';
import { PlaybookRunEntity } from './playbook-run.entity';
import { PlaybookRunService } from './playbook-run.service';

@Resolver(() => PlaybookRunEntity)
export class PlaybookRunResolver {
  constructor(
    @InjectLogger(PlaybookRunResolver.name)
    private readonly logger: Logger,
    private playbookService: PlaybookService,
    private playbookRunService: PlaybookRunService,
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
    const result = await this.playbookService.readPlaybook({ playbookId });
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

  @Mutation(() => PlaybookRunEntity)
  async updatePlaybookRun(
    @Args()
    args: UpdatePlaybookRunArgs,
  ): Promise<PlaybookRun> {
    const result = await this.playbookRunService.updatePlaybookRun(args);
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
