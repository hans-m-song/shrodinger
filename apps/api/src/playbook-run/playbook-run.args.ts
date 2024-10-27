import { ArgsType, Field, Int } from '@nestjs/graphql';
import {
  ListPlaybookRunsAttributes,
  CreatePlaybookRunAttributes,
  PlaybookRunStatus,
  UpdatePlaybookRunAttributes,
} from '@shrodinger/contracts';
import { PaginationArgs } from '../dtos/pagination.args';

@ArgsType()
export class ListPlaybookRunsArgs
  extends PaginationArgs
  implements ListPlaybookRunsAttributes
{
  @Field(() => Int, { nullable: true })
  playbookId?: number;

  @Field(() => Int, { nullable: true })
  playbookRunId?: number;
}

@ArgsType()
export class CreatePlaybookRunArgs implements CreatePlaybookRunAttributes {
  @Field(() => Int)
  declare playbookId: number;

  @Field(() => PlaybookRunStatus, { defaultValue: PlaybookRunStatus.Pending })
  declare status: PlaybookRunStatus;

  @Field(() => String, { defaultValue: '{}' })
  declare contents: string;
}

@ArgsType()
export class UpdatePlaybookRunArgs implements UpdatePlaybookRunAttributes {
  @Field(() => Int, { nullable: false })
  declare playbookRunId: number;

  @Field(() => PlaybookRunStatus, { nullable: true })
  declare status?: PlaybookRunStatus;

  @Field(() => String, { nullable: true })
  declare contents?: string;
}

@ArgsType()
export class DeletePlaybookRunArgs {
  @Field(() => Int)
  declare playbookRunId: number;
}
