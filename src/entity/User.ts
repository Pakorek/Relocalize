import { Field, InputType, ObjectType } from 'type-graphql';
import {
  Entity,
  BaseEntity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { IsBoolean, IsEmail, IsNotEmpty, Length } from 'class-validator';
import { ContactInformation } from './ContactInformation';
import { Place } from './Place';
import { Upload } from './Upload';

export type ROLE = 'CLIENT' | 'PROFESSIONAL';

@ObjectType('User')
@InputType('UserInput')
@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Field()
  @Column({ unique: true, type: 'varchar', length: 50 })
  @IsEmail({}, { message: 'Incorrect email' })
  email!: string;

  @Field()
  @Column({ type: 'varchar', length: 255 })
  password!: string;

  @Field()
  @Column({ type: 'varchar', length: 35 })
  @IsNotEmpty({ message: 'The firstname is required' })
  first_name!: string;

  @Field()
  @Column({ type: 'varchar', length: 35 })
  @IsNotEmpty({ message: 'The lastname is required' })
  last_name!: string;

  @Field()
  @Column({ type: 'varchar', length: 35 })
  pseudo?: string;

  // @Field()
  // @Column({
  //   type: 'varchar',
  //   length: 255,
  //   default:
  //     'https://gravatar.com/avatar/dba6bae8c566f9d4041fb9cd9ada7741?d=identicon&f=y',
  // })
  // avatar?: string;

  @Field()
  @Column({ type: 'json' })
  roles!: string;

  @OneToMany(() => Place, (place) => place.owner)
  places?: Place[];

  @OneToMany(() => Upload, (upload) => upload.user)
  uploads?: Upload[];

  // @OneToOne(() => ContactInformation)
  // @JoinColumn()
  // contact_information!: ContactInformation;

  @CreateDateColumn({ type: 'timestamp' })
  created_at!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at!: Date;
}
