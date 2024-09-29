import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { Playbook } from './playbook.model';
import { PlaybookService } from './playbook.service';
import { PlaybookRun } from '../playbook-run/playbook-run.model';
import { PlaybookRunService } from '../playbook-run/playbook-run.service';
import { ListPlaybooksArgs } from './dtos/list-playbooks.args';
import { ListPlaybookRunsArgs } from './dtos/list-playbook-runs.args';
import { CreatePlaybookArgs } from './dtos/create-playbook.args';

@Resolver(() => Playbook)
export class PlaybookResolver {
  constructor(
    private playbookService: PlaybookService,
    private playbookRunService: PlaybookRunService,
  ) {}

  @Query(() => [Playbook])
  async playbooks(@Args() args: ListPlaybooksArgs): Promise<Playbook[]> {
    return this.playbookService.list({ ...args });
  }

  @ResolveField(() => [PlaybookRun])
  async playbookRuns(
    @Parent() playbook: Playbook,
    @Args() args: ListPlaybookRunsArgs,
  ): Promise<PlaybookRun[]> {
    return this.playbookRunService.list({
      playbookId: playbook.playbookId,
      ...args,
    });
  }

  @Mutation(() => Playbook)
  async createPlaybook(@Args() args: CreatePlaybookArgs): Promise<Playbook> {
    return this.playbookService.create(args);
  }
}
