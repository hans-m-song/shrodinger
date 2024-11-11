import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Playbook } from '@shrodinger/contracts';
import { ActiveRecordEntity } from '../dtos/active-record.entity';
import { PlaybookAttributes } from '../database';

@ObjectType('Playbook', { implements: () => [ActiveRecordEntity] })
export class PlaybookEntity
  extends ActiveRecordEntity
  implements Playbook, PlaybookAttributes
{
  @Field(() => Int)
  declare playbookId: Playbook['playbookId'];

  @Field(() => Boolean)
  declare active: Playbook['active'];

  @Field(() => String)
  declare filepath: Playbook['filepath'];
}
