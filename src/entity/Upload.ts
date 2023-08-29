import { Field, InputType, ObjectType } from 'type-graphql';
import {
  Entity,
  BaseEntity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn, ManyToOne,
} from 'typeorm';
import { IsUrl } from 'class-validator';
import { User } from './User';
import { ReadStream } from 'fs';

@ObjectType('Image')
@InputType('ImageInput')
@Entity()
export class Upload extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Field()
  @Column()
  filename!: string;

  @Field()
  @Column()
  mimetype!: string;

  @Field()
  @Column()
  encoding!: string;

  @Field()
  @Column()
  @IsUrl()
  url!: string;

  createReadStream!: () => ReadStream;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt!: Date;

  @ManyToOne(() => User, (user) => user.uploads)
  user?: User;
}
