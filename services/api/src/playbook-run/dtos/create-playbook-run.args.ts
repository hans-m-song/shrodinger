import { ArgsType, Field, Int } from '@nestjs/graphql';

@ArgsType()
export class CreatePlaybookRunArgs {
  @Field(() => Int)
  playbookId: number;
}
