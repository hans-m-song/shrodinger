import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Playbook } from '@shrodinger/contracts';
import { GraphQLBigInt, GraphQLJSON } from 'graphql-scalars';

@ObjectType('Playbook')
export class PlaybookEntity implements Playbook {
  @Field(() => Int)
  declare playbookId: number;

  @Field(() => String)
  declare filepath: string;

  @Field(() => GraphQLJSON)
  declare contents: Record<string, unknown>;

  @Field(() => GraphQLBigInt)
  declare createdAt: number;

  @Field(() => GraphQLBigInt)
  declare updatedAt: number;
}
