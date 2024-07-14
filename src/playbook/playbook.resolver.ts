import { Args, Int, Query, Resolver } from '@nestjs/graphql';
import { Playbook } from './playbook.model';
import { PlaybookService } from './playbook.service';

@Resolver(() => Playbook)
export class PlaybookResolver {
  constructor(private playbookService: PlaybookService) {}

  @Query(() => [Playbook])
  async playbooks(
    @Args('skip', { type: () => Int, nullable: true }) skip: number,
    @Args('take', { type: () => Int, nullable: true }) take: number,
  ): Promise<Playbook[]> {
    return this.playbookService.list({ skip, take });
  }
}
