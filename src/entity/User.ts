import { Authorized, Field, InputType, ObjectType } from 'type-graphql';
import {
  Entity,
  BaseEntity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn, OneToMany,
} from 'typeorm';
import { IsBoolean, IsEmail, IsNotEmpty, IsOptional, Length } from 'class-validator';
import { ContactInformation } from './ContactInformation';
import { Product } from './Product';
import { Shop } from './Shop';
import { Image } from './Image';

export type ROLE = 'CLIENT' | 'PROFESSIONAL';

@ObjectType('User')
@InputType('UserInput')
@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Field()
  @Column({ default: false })
  @IsBoolean()
  validated!: boolean; // true if rcs

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
  @Column({ type: 'varchar', length: 11, default: 'CLIENT' })
  role!: ROLE;

  @OneToMany(() => Shop, (shop) => shop.owner)
  shops?: Shop[];

  @OneToMany(() => Shop, (shop) => shop.contributor)
  contributions?: Shop[];

  @OneToMany(() => Image, (image) => image.user)
  images?: Image[];

  @OneToOne(() => ContactInformation)
  @JoinColumn()
  contact_information!: ContactInformation;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt!: Date;
}
