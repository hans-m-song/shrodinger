import { Field, Int, ObjectType } from '@nestjs/graphql';
import GraphQLJSON from 'graphql-type-json';
import { InferAttributes } from 'sequelize';
import {
  AutoIncrement,
  Column,
  DataType,
  Default,
  HasMany,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { Playbook } from '@shrodinger/contracts';
import sequelize from 'sequelize';
import { PlaybookRunModel } from './playbook-run.model';

export type PlaybookAttributes = Omit<InferAttributes<PlaybookModel>, 'id'>;

export type PlaybookCreationAttributes = Omit<
  PlaybookAttributes,
  'playbookId' | 'playbookRuns' | 'createdAt' | 'modifiedAt'
>;

@ObjectType('Playbook')
@Table({ tableName: 'playbooks' })
export class PlaybookModel extends Model implements Playbook {
  @Field(() => Int)
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  declare playbookId: number;

  @Field(() => String)
  @Column(DataType.TEXT)
  declare filepath: string;

  @Field(() => GraphQLJSON)
  @Column(DataType.JSON)
  declare contents: unknown;

  @Field(() => Int)
  @Default(sequelize.literal('(unixepoch())'))
  @Column(DataType.NUMBER)
  declare createdAt: number;

  @Field(() => Int)
  @Default(sequelize.literal('(unixepoch())'))
  @Column(DataType.NUMBER)
  declare modifiedAt: number;

  @HasMany(() => PlaybookRunModel)
  declare playbookRuns: PlaybookRunModel;
}
