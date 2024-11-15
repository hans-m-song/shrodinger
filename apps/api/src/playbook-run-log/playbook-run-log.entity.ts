import { Field, Int, ObjectType } from '@nestjs/graphql';
import { AnsibleLog, PlaybookRunLog } from '@shrodinger/contracts';
import { GraphQLJSON } from 'graphql-scalars';
import { PlaybookRunLogAttributes } from '../database';

@ObjectType('PlaybookRunLog')
export class PlaybookRunLogEntity
  implements PlaybookRunLog, PlaybookRunLogAttributes
{
  @Field(() => Int)
  declare playbookRunId: number;

  @Field(() => Int)
  declare sequence: number;

  @Field(() => GraphQLJSON)
  declare contents: AnsibleLog & Record<string, unknown>;
}
