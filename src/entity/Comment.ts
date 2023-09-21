import { Field, InputType, ObjectType } from 'type-graphql';
import {
  Entity,
  BaseEntity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToMany,
  JoinTable,
  CreateDateColumn,
  UpdateDateColumn, ManyToOne, OneToOne, JoinColumn, BeforeInsert
} from "typeorm";
import {IsBoolean, IsNotEmpty, IsPositive, Length} from 'class-validator';
import {Upload} from "./Upload";
import {User} from "./User";
import {Speak} from "./Speak";


@ObjectType('Comment')
@InputType('CommentInput')
@Entity()
export class Comment extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Field()
  @Column({ type: 'varchar', length: 255 })
  @Length(1, 255, {
    message:
      'The message must be at least 1 but not longer than 255 characters',
  })
  content!: string;

  @Field()
  @Column({type: 'smallint', default: 0})
  @IsPositive()
  nbLikes?: number;

  @Column({ type: 'int' })
  owner_id!: number;

  @Column({ type: 'int' })
  speak_id!: number;

  @ManyToOne(() => Speak, (speak) => speak.comments)
  @JoinColumn({ name: 'speak_id', referencedColumnName: 'id' })
  @Field(() => Speak)
  speak!: Speak;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'owner_id', referencedColumnName: 'id' })
  @Field(() => User)
  owner!: User;

  @Field()
  @CreateDateColumn({ type: 'timestamp' })
  created_at!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at!: Date;

  @BeforeInsert()
  updateDates() {
    this.created_at = new Date();
  }
}
