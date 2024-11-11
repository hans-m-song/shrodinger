import { ArgsType, Field, InputType, Int } from '@nestjs/graphql';
import { Pagination, Range } from '@shrodinger/contracts';

@InputType('Range')
export class RangeArgs implements Range {
  @Field(() => Int, { nullable: true })
  declare from: number;

  @Field(() => Int, { nullable: true })
  declare to: number;
}

@ArgsType()
export class PaginationArgs implements Pagination {
  @Field(() => Int, { nullable: true, defaultValue: 10 })
  declare limit: number;

  @Field(() => Int, { nullable: true, defaultValue: 0 })
  declare offset: number;
}

@ArgsType()
export class ListActiveRecordEntityArgs extends PaginationArgs {
  @Field(() => RangeArgs, { nullable: true })
  declare version?: Range;

  @Field(() => RangeArgs, { nullable: true })
  declare createdAt?: Range;

  @Field(() => RangeArgs, { nullable: true })
  declare updatedAt?: Range;
}
