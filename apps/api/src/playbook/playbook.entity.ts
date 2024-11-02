import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Playbook } from '@shrodinger/contracts';
import { GraphQLJSON } from 'graphql-scalars';
import { ActiveRecordEntity } from '../dtos/active-record.entity';

@ObjectType('Playbook')
export class PlaybookEntity extends ActiveRecordEntity implements Playbook {
  @Field(() => Int)
  declare playbookId: number;

  @Field(() => String)
  declare filepath: string;

  @Field(() => GraphQLJSON)
  declare contents: Record<string, unknown>;
}
