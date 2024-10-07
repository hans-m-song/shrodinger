import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { PlaybookService } from './playbook.service';
import { ListPlaybooksArgs } from './dtos/list-playbooks.args';
import { errors } from '@shrodinger/core/errors';
import { Playbook } from '@shrodinger/contracts';
import { CreatePlaybookArgs } from './dtos/create-playbook.args';
import { GraphQLError } from 'graphql';
import { Logger } from '@nestjs/common';
import { PlaybookModel } from '../database/models/playbook.model';

@Resolver(() => PlaybookModel)
export class PlaybookResolver {
  private logger = new Logger(PlaybookResolver.name);

  constructor(
    private playbookService: PlaybookService,
    // private playbookRunService: PlaybookRunService,
  ) {}

  @Query(() => [PlaybookModel])
  async playbooks(@Args() args: ListPlaybooksArgs): Promise<Playbook[]> {
    const result = await this.playbookService.list({ ...args });
    if (!result.ok) {
      const error = errors.flat(result.error);
      this.logger.error(error.message, error.stack, error.context);
      throw new GraphQLError(result.error.message, {
        extensions: { code: result.error.name },
      });
    }

    return result.data;
  }

  // @ResolveField(() => [PlaybookRunModel])
  // async playbookRuns(
  //   @Parent() playbook: PlaybookModel,
  //   @Args() args: ListPlaybookRunsArgs,
  // ): Promise<PlaybookRun[]> {
  //   const result = await this.playbookRunService.list({
  //     playbookId: playbook.playbookId,
  //     ...args,
  //   });
  //   if (!result.ok) {
  //     const error = errors.flat(result.error);
  //     this.logger.error(error.message, error.stack, error.context);
  //     throw new GraphQLError(result.error.message, {
  //       extensions: { code: result.error.name },
  //     });
  //   }

  //   return result.data;
  // }

  @Mutation(() => PlaybookModel)
  async createPlaybook(@Args() args: CreatePlaybookArgs): Promise<Playbook> {
    const result = await this.playbookService.create(args);
    if (!result.ok) {
      const error = errors.flat(result.error);
      this.logger.error(error.message, error.stack, error.context);
      throw new GraphQLError(result.error.message, {
        extensions: { code: result.error.name },
      });
    }

    return result.data;
  }
}
