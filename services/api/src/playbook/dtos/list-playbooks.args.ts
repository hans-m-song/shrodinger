import { ArgsType, Field, Int } from '@nestjs/graphql';
import { PaginationArgs } from '../../dtos/pagination.args';

@ArgsType()
export class ListPlaybooksArgs extends PaginationArgs {
  @Field(() => Int, { nullable: true })
  playbookId?: number;
}
