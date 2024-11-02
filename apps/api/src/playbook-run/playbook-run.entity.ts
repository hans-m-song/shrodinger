import { Field, Int, ObjectType, registerEnumType } from '@nestjs/graphql';
import { PlaybookRun, PlaybookRunStatus } from '@shrodinger/contracts';
import { GraphQLBigInt } from 'graphql-scalars';
import { ActiveRecordEntity } from '../dtos/active-record.entity';

registerEnumType(PlaybookRunStatus, { name: 'PlaybookRunStatus' });

@ObjectType('PlaybookRun')
export class PlaybookRunEntity
  extends ActiveRecordEntity
  implements PlaybookRun
{
  @Field(() => Int)
  declare playbookRunId: number;

  @Field(() => Int)
  declare playbookId: number;

  @Field(() => PlaybookRunStatus)
  declare status: PlaybookRunStatus;

  @Field(() => GraphQLBigInt, { nullable: true })
  declare startedAt: number | null;

  @Field(() => GraphQLBigInt, { nullable: true })
  declare completedAt: number | null;
}
