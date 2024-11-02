import { ObjectType, Field, Int } from '@nestjs/graphql';
import { GraphQLBigInt } from 'graphql-scalars';

@ObjectType('ActiveRecord')
export class ActiveRecordEntity {
  @Field(() => Int)
  declare version: number;

  @Field(() => GraphQLBigInt)
  declare createdAt: number;

  @Field(() => GraphQLBigInt)
  declare updatedAt: number;
}
