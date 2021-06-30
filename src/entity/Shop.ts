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
import { Schedules } from './Schedules';

export type BILLING_PLAN = 'FREE' | 'COMMISSION'
export type PROFESSIONAL_AREA =
  | 'ARTISAN'
  | 'FARMER'
  | 'MERCHANT'
  | 'SERVICE PROVIDER'
  | '...'


@ObjectType('Shop')
@InputType('ShopInput')
@Entity()
export class Shop extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Field()
  @Column({ type: 'varchar', length: 255 })
  @IsNotEmpty({ message: 'The name is required' })
  name!: string;

  @Field()
  @Column({ type: 'varchar', length: 255 })
  @IsNotEmpty({ message: 'The professional area is required' })
  typeOf!: PROFESSIONAL_AREA;

  @Field()
  @Column({ unique: true, type: 'number' })
  rcs?: number;

  @Field()
  @Column({ type: 'varchar', length: 255 })
  billing_plan?: BILLING_PLAN;

  @Field()
  @Column({ type: 'number' })
  latitude?: number;

  @Field()
  @Column({ type: 'number' })
  longitude?: number;

  @OneToOne(() => ContactInformation)
  @JoinColumn()
  contact_information!: ContactInformation;

  @OneToOne(() => Schedules)
  @JoinColumn()
  schedules?: Schedules;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt!: Date;
}
