import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Playbook } from './playbook.model';
import { PlaybookService } from './playbook.service';
import GraphQLJSON from 'graphql-type-json';

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

  @Mutation(() => Playbook)
  async createPlaybook(
    @Args({ name: 'playbookId', type: () => String, nullable: false })
    playbookId: string,
    @Args({ name: 'filepath', type: () => String, nullable: false })
    filepath: string,
    @Args({ name: 'contents', type: () => GraphQLJSON, nullable: false })
    contents: JSON,
  ): Promise<Playbook> {
    return this.playbookService.create({
      playbookId,
      filepath,
      contents,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
  }
}
