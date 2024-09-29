import { Field, Int, ObjectType } from '@nestjs/graphql';
import GraphQLJSON from 'graphql-type-json';
import { DataTypes, InferAttributes } from 'sequelize';
import {
  AutoIncrement,
  Column,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';

export type PlaybookAttributes = InferAttributes<Playbook>;
export type PlaybookCreationAttributes = Omit<PlaybookAttributes, 'playbookId'>;

@ObjectType()
@Table({ tableName: 'playbooks' })
export class Playbook extends Model {
  @Field(() => Int)
  @PrimaryKey
  @AutoIncrement
  @Column(DataTypes.INTEGER)
  playbookId: number;

  @Field(() => String)
  @Column(DataTypes.TEXT)
  filepath: string;

  @Field(() => GraphQLJSON)
  @Column(DataTypes.JSON)
  contents: JSON;
}
