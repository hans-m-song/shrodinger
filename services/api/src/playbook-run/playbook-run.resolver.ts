import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { PlaybookRun } from './playbook-run.model';
import { PlaybookRunService } from './playbook-run.service';
import { ListPlaybookRunsArgs } from './dtos/list-playbook-runs.args';
import { Playbook } from '../playbook/playbook.model';
import { PlaybookService } from '../playbook/playbook.service';
import { CreatePlaybookRunArgs } from './dtos/create-playbook-run.args';
import { PlaybookRunStatus } from './constants';

@Resolver(() => PlaybookRun)
export class PlaybookRunResolver {
  constructor(
    private playbookService: PlaybookService,
    private playbookRunService: PlaybookRunService,
  ) {}

  @Query(() => [PlaybookRun])
  async playbookRuns(
    @Args() args: ListPlaybookRunsArgs,
  ): Promise<PlaybookRun[]> {
    return this.playbookRunService.list(args);
  }

  @ResolveField(() => Playbook)
  async playbook(@Parent() playbookRun: PlaybookRun): Promise<Playbook> {
    return this.playbookService.get(playbookRun.playbookId);
  }

  @Mutation(() => PlaybookRun)
  async createPlaybookRun(
    @Args() args: CreatePlaybookRunArgs,
  ): Promise<PlaybookRun> {
    return this.playbookRunService.create({
      playbookId: args.playbookId,
      status: PlaybookRunStatus.Pending,
      contents: '',
    });
  }
}
