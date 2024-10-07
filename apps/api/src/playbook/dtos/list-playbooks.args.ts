import { ArgsType, Field, Int } from '@nestjs/graphql';
import { PaginationArgs } from '../../dtos/pagination.args';

export interface ListPlaybooksSearch {
  filepath?: string;
}

@ArgsType()
export class ListPlaybooksArgs
  extends PaginationArgs
  implements ListPlaybooksSearch
{
  @Field(() => Int, { nullable: true })
  filepath?: string;
}
