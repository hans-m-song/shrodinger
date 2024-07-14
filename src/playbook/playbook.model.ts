import { Field, ObjectType } from '@nestjs/graphql';
import { GraphQLJSON } from 'graphql-type-json';
import { InferCreationAttributes, literal } from 'sequelize';
import { Column, DataType, Model, Table } from 'sequelize-typescript';

export type IPlaybook = InferCreationAttributes<Playbook>;

@ObjectType()
@Table({ tableName: 'playbooks', timestamps: false })
export class Playbook extends Model {
  @Field(() => String)
  @Column({ type: DataType.TEXT, primaryKey: true })
  id: string;

  @Field(() => String)
  @Column({ type: DataType.TEXT })
  filepath: string;

  @Field(() => GraphQLJSON)
  @Column({ type: DataType.JSON })
  contents: JSON;

  @Field(() => Number)
  @Column({
    type: DataType.NUMBER,
    defaultValue: literal('(unixepoch() * 1000)'),
  })
  createdAt: number;

  @Field(() => Number)
  @Column({
    type: DataType.NUMBER,
    defaultValue: literal('(unixepoch() * 1000)'),
  })
  updatedAt: number;
}
