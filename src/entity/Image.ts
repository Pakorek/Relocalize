import { Field, InputType, ObjectType } from 'type-graphql';
import {
  Entity,
  BaseEntity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn, OneToMany, ManyToOne,
} from 'typeorm';
import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { Category } from './Category';
import { Shop } from './Shop';
import { User } from './User';

@ObjectType('Image')
@InputType('ImageInput')
@Entity()
export class Image extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Field()
  @Column({ type: 'varchar', length: 255 })
  @IsNotEmpty({ message: 'The title is required' })
  title!: string;


  @Field()
  @Column({ type: 'varchar', length: 255 })
  @IsNotEmpty({ message: 'The url is required' })
  url!: string;

  @ManyToOne(() => User, (user) => user.images)
  user!: User;
}
