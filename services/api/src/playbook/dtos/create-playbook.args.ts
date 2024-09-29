import { ArgsType, Field } from '@nestjs/graphql';
import GraphQLJSON from 'graphql-type-json';

@ArgsType()
export class CreatePlaybookArgs {
  @Field(() => String, { nullable: false })
  filepath: string;

  @Field(() => GraphQLJSON, { nullable: false })
  contents: JSON;
}
