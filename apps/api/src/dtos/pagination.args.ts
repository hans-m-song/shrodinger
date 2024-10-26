import { ArgsType, Field, Int } from '@nestjs/graphql';

@ArgsType()
export class PaginationArgs {
  @Field(() => Int, { nullable: true, defaultValue: 10 })
  limit = 10;

  @Field(() => Int, { nullable: true, defaultValue: 0 })
  offset = 0;
}
