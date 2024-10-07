import { ArgsType, Field } from '@nestjs/graphql';
import GraphQLJSON from 'graphql-type-json';
import { PlaybookCreationAttributes } from '../playbook.model';

@ArgsType()
export class CreatePlaybookArgs implements PlaybookCreationAttributes {
  @Field(() => String, { nullable: false })
  declare filepath: string;

  @Field(() => GraphQLJSON, { nullable: false })
  declare contents: JSON;
}
