import { Field, Int, ObjectType } from '@nestjs/graphql';
import { PlaybookRunLog } from '@shrodinger/contracts';
import { GraphQLJSON } from 'graphql-scalars';

@ObjectType('PlaybookRunLog')
export class PlaybookRunLogEntity implements PlaybookRunLog {
  @Field(() => Int)
  declare playbookRunId: number;

  @Field(() => Int)
  declare sequence: number;

  @Field(() => GraphQLJSON)
  declare contents: Record<string, unknown>;
}
