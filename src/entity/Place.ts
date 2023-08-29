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
  ManyToOne,
} from 'typeorm';
import { IsBoolean, IsNotEmpty, IsOptional } from 'class-validator';
import { Schedules } from './Schedules';
import { Product } from './Product';
import { Service } from './Service';
import { User } from './User';

export type BILLING_PLAN = 'FREE' | 'COMMISSION';
export type PROFESSIONAL_AREA =
  | 'ARTISAN'
  | 'FARMER'
  | 'MERCHANT'
  | 'SERVICE PROVIDER'
  | '...';

@ObjectType('Place')
@InputType('PlaceInput')
@Entity()
export class Place extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Field()
  @Column({ type: 'bool', default: false })
  @IsBoolean()
  validated?: boolean;

  @Field()
  @Column({ type: 'varchar', length: 255 })
  @IsNotEmpty({ message: 'The name is required' })
  name!: string;

  @Field()
  @Column({ type: 'varchar', length: 255, default: '' })
  website?: string;

  @Field()
  @Column({ type: 'varchar', length: 255, default: '' })
  phone?: string;

  @Field()
  @Column({ type: 'varchar', length: 255 })
  @IsNotEmpty({ message: 'The professional area is required' })
  professionalArea!: string; // ex: Restaurateur

  @Field()
  @Column({ type: 'varchar', length: 255, default: '' })
  // @IsNotEmpty({ message: 'The professional class is required' })
  professionalClass?: string; // ex: Service des traiteurs

  @Field()
  @Column({ type: 'varchar', default: '' })
  siret?: string;

  @Field()
  @Column({ type: 'varchar', default: '' })
  shortDescription?: string;

  @Field()
  @Column({ type: 'float' })
  latitude!: number;

  @Field()
  @Column({ type: 'float' })
  longitude!: number;

  @ManyToOne(() => User, (user) => user.places)
  owner?: User;

  @Field()
  @Column({ type: 'varchar', length: 255, default: 'FREE' })
  billing_plan?: BILLING_PLAN;

  @OneToMany(() => Product, (product) => product.place)
  products?: Product[];

  @OneToMany(() => Service, (service) => service.place)
  services?: Service[];

  @OneToOne(() => Schedules)
  @JoinColumn()
  schedules?: Schedules;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt!: Date;

  // @OneToOne(() => ContactInformation)
  // @JoinColumn()
  // contact_information!: ContactInformation;

  @Field()
  @Column({ type: 'varchar', length: 35 })
  @IsNotEmpty()
  address_1!: string;

  @Field()
  @Column({ type: 'varchar', length: 35, nullable: true })
  @IsOptional()
  address_2?: string;

  @Field()
  @Column({ type: 'varchar', length: 35, nullable: true })
  @IsOptional()
  address_3?: string;

  @Field()
  @Column({ type: 'varchar', length: 35 })
  @IsNotEmpty()
  city!: string;

  @Field()
  @Column({ type: 'varchar', length: 6 })
  @IsNotEmpty()
  zipCode!: string;

  @Field()
  @Column({ type: 'varchar', length: 35 })
  @IsNotEmpty()
  department!: string;

  @Field()
  @Column({ type: 'varchar', length: 70, default: 'France' })
  @IsNotEmpty()
  country?: string;
}
