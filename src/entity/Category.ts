import { Field, InputType, ObjectType } from 'type-graphql';
import {
  Entity,
  BaseEntity,
  Column,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { IsNotEmpty } from 'class-validator';

@ObjectType('Category')
@InputType('CategoryInput')
@Entity()
export class Category extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Field()
  @Column({ unique: true, type: 'varchar', length: 255 })
  @IsNotEmpty({ message: 'The name is required' })
  name!: string;
}
