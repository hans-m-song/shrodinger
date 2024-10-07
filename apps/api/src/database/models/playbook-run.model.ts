import { Field, Int, ObjectType, registerEnumType } from '@nestjs/graphql';
import { InferAttributes } from 'sequelize';
import {
  AutoIncrement,
  BelongsTo,
  Column,
  DataType,
  Default,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { PlaybookModel } from './playbook.model';
import { PlaybookRun, PlaybookRunStatus } from '@shrodinger/contracts';
import sequelize from 'sequelize';

registerEnumType(PlaybookRunStatus, { name: 'PlaybookRunStatus' });

export type PlaybookRunAttributes = Omit<
  InferAttributes<PlaybookRunModel>,
  'id'
>;

export type PlaybookRunCreationAttributes = Omit<
  PlaybookRunAttributes,
  | 'playbookRunId'
  | 'playbook'
  | 'createdAt'
  | 'modifiedAt'
  | 'startedAt'
  | 'completedAt'
>;

@ObjectType('PlaybookRun')
@Table({ tableName: 'playbook_runs' })
export class PlaybookRunModel extends Model implements PlaybookRun {
  @Field(() => Int)
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  declare playbookRunId: number;

  @Field(() => Int)
  @ForeignKey(() => PlaybookModel)
  @Column(DataType.NUMBER)
  declare playbookId: number;

  @Field(() => PlaybookRunStatus)
  @Column(DataType.TEXT)
  declare status: PlaybookRunStatus;

  @Field(() => String)
  @Column(DataType.TEXT)
  declare contents: string;

  @Field(() => Int)
  @Default(sequelize.literal('(unixepoch())'))
  @Column(DataType.NUMBER)
  declare createdAt: number;

  @Field(() => Int)
  @Default(sequelize.literal('(unixepoch())'))
  @Column(DataType.NUMBER)
  declare modifiedAt: number;

  @Field(() => Int)
  @Column(DataType.NUMBER)
  declare startedAt: number;

  @Field(() => Int)
  @Column(DataType.NUMBER)
  declare completedAt: number;

  @BelongsTo(() => PlaybookModel)
  declare playbook: PlaybookModel;
}
