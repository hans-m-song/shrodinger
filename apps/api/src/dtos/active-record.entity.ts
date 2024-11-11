import { Field, Int, InterfaceType } from '@nestjs/graphql';
import { ActiveRecord } from '@shrodinger/contracts';
import { GraphQLBigInt } from 'graphql-scalars';

@InterfaceType('ActiveRecord')
export abstract class ActiveRecordEntity implements ActiveRecord {
  @Field(() => Int)
  declare version: number;

  @Field(() => GraphQLBigInt)
  declare createdAt: number;

  @Field(() => GraphQLBigInt)
  declare updatedAt: number;
}
