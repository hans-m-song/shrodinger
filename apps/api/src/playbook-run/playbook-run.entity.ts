import { Field, Int, ObjectType, registerEnumType } from '@nestjs/graphql';
import { PlaybookRun, PlaybookRunStatus } from '@shrodinger/contracts';
import { GraphQLBigInt } from 'graphql-scalars';

registerEnumType(PlaybookRunStatus, { name: 'PlaybookRunStatus' });

@ObjectType('PlaybookRun')
export class PlaybookRunEntity implements PlaybookRun {
  @Field(() => Int)
  declare playbookRunId: number;

  @Field(() => Int)
  declare playbookId: number;

  @Field(() => PlaybookRunStatus)
  declare status: PlaybookRunStatus;

  @Field(() => String)
  declare contents: string;

  @Field(() => GraphQLBigInt)
  declare createdAt: number;

  @Field(() => GraphQLBigInt)
  declare updatedAt: number;

  @Field(() => GraphQLBigInt, { nullable: true })
  declare startedAt: number | null;

  @Field(() => GraphQLBigInt, { nullable: true })
  declare completedAt: number | null;
}
