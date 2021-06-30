import { Authorized, Field, InputType, ObjectType } from 'type-graphql';
import {
  Entity,
  BaseEntity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { IsEmail, IsNotEmpty, Length } from 'class-validator';
import { ContactInformation } from './ContactInformation';

export type ROLE = 'ANON' | 'CLIENT' | 'PROFESSIONAL';

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
  @Length(6, 30, {
    message:
      'The password must be at least 6 but not longer than 30 characters',
  })
  password!: string;

  @Field()
  @Column({ type: 'varchar', length: 35 })
  @IsNotEmpty({ message: 'The firstname is required' })
  firstName!: string;

  @Field()
  @Column({ type: 'varchar', length: 35 })
  @IsNotEmpty({ message: 'The lastname is required' })
  lastName!: string;

  @Field()
  @Column({ type: 'varchar', length: 11 })
  @IsNotEmpty({ message: 'The role is required' })
  role!: ROLE;

  @OneToOne(() => ContactInformation)
  @JoinColumn()
  contact_information!: ContactInformation;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt!: Date;
}
