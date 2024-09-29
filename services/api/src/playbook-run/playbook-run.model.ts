import { Field, Int, ObjectType } from '@nestjs/graphql';
import { InferAttributes } from 'sequelize';
import {
  AutoIncrement,
  Column,
  DataType,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { Playbook } from '../playbook/playbook.model';
import { PlaybookRunStatus } from './constants';

export type PlaybookRunAttributes = InferAttributes<PlaybookRun>;
export type PlaybookRunCreationAttributes = Omit<
  PlaybookRunAttributes,
  'playbookRunId'
>;

@ObjectType()
@Table({ tableName: 'playbook_runs' })
export class PlaybookRun extends Model {
  @Field(() => Int)
  @PrimaryKey
  @AutoIncrement
  @Column({ type: DataType.INTEGER })
  playbookRunId: number;

  @Field(() => Int)
  @ForeignKey(() => Playbook)
  @Column({ type: DataType.NUMBER })
  playbookId: number;

  @Field(() => PlaybookRunStatus)
  @Column({ type: DataType.TEXT })
  status: PlaybookRunStatus;

  @Field(() => String)
  @Column({ type: DataType.TEXT })
  contents: string;
}
