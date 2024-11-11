import { Field, Int, ObjectType, registerEnumType } from '@nestjs/graphql';
import { PlaybookRun, PlaybookRunStatus } from '@shrodinger/contracts';
import { GraphQLBigInt } from 'graphql-scalars';
import { ActiveRecordEntity } from '../dtos/active-record.entity';
import { PlaybookRunAttributes } from '../database';

registerEnumType(PlaybookRunStatus, { name: 'PlaybookRunStatus' });

@ObjectType('PlaybookRun', { implements: () => [ActiveRecordEntity] })
export class PlaybookRunEntity
  extends ActiveRecordEntity
  implements PlaybookRun, PlaybookRunAttributes
{
  @Field(() => Int)
  declare playbookRunId: number;

  @Field(() => Int)
  declare playbookId: number;

  @Field(() => Int)
  declare playbookVersion: number;

  @Field(() => PlaybookRunStatus)
  declare status: PlaybookRunStatus;

  @Field(() => GraphQLBigInt, { nullable: true })
  declare startedAt: number | null;

  @Field(() => GraphQLBigInt, { nullable: true })
  declare completedAt: number | null;
}
