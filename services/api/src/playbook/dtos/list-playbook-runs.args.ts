import { ArgsType, Field, Int } from '@nestjs/graphql';
import { PaginationArgs } from '../../dtos/pagination.args';

@ArgsType()
export class ListPlaybookRunsArgs extends PaginationArgs {
  @Field(() => Int, { nullable: true })
  playbookId?: number;

  @Field(() => Int, { nullable: true })
  playbookRunId?: number;
}
