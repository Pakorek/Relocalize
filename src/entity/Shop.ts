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
} from 'typeorm';
import { IsNotEmpty } from 'class-validator';
import { ContactInformation } from './ContactInformation';

export type BILLING_PLAN = 'FREE' | 'COMMISSION'


@ObjectType('Shop')
@InputType('ShopInput')
@Entity()
export class Shop extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Field()
  @Column({ type: 'varchar', length: 255 })
  @IsNotEmpty({ message: 'The firstname is required' })
  name!: string;

  @Field()
  @Column({ type: 'number' })
  rcs?: number;

  @Field()
  @Column({ type: 'varchar', length: 255 })
  billing_plan?: BILLING_PLAN;

  @OneToOne(() => ContactInformation)
  @JoinColumn()
  contact_information!: ContactInformation;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt!: Date;

}
