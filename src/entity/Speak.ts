import {Field, InputType, Int, ObjectType} from 'type-graphql';
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
import {User} from "./User";
import {Comment} from "./Comment";

export type TargetType = "PUBLIC" | "PRIVATE";


@ObjectType('Speak')
@InputType('SpeakInput')
@Entity()
export class Speak extends BaseEntity {
  @Field()
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
  @Column({ type: 'varchar', length: 7 })
  @IsNotEmpty({ message: 'The target is required' })
  target!: TargetType;

  // TODO : virtual column
  nbLikes?: number;

  @Field()
  @Column({type: 'smallint', default: 0})
  @IsPositive()
  nb_of_shares?: number;

  @Field()
  @Column({type: 'boolean'})
  @IsBoolean()
  is_event!: boolean;

  @Field()
  @Column({ type: 'timestamp' })
  from_date?: Date;

  @Field()
  @Column({ type: 'timestamp' })
  to_date?: Date;

  @Field()
  @Column({type: 'boolean'})
  @IsBoolean()
  is_registration_required!: boolean;

  @Field()
  @Column({type: 'boolean'})
  @IsBoolean()
  is_comment_allowed!: boolean;

  @Column({ type: 'int' })
  owner_id!: number;

  @ManyToOne(() => User, (user) => user.speaks)
  @JoinColumn({ name: 'owner_id', referencedColumnName: 'id' })
  @Field(() => User)
  @IsNotEmpty()
  owner!: User;

  // speak has files
  // @OneToMany(() => Upload, (upload) => upload.artist2Client)
  // uploads?: Upload[];

  // speak has comments
  @Field(() => [Comment])
  @OneToMany(() => Comment, (comment) => comment.speak)
  comments?: Comment[];

  // Manage likes
  @Field(() => [User])
  @ManyToMany(() => User)
  @JoinTable({
    name: 'speaks_are_liked',
    joinColumn: {
      name: 'speak_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'user_id',
      referencedColumnName: 'id',
    },
  })
  likes?: User[];

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
