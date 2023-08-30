import { Field, InputType, ObjectType } from 'type-graphql';
import {
  Entity,
  BaseEntity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { Product } from './Product';
import { User } from './User';
import { Category } from './Category';
import { Upload } from './Upload';
import { Tag } from './Tag';

// export type BILLING_PLAN = 'FREE' | 'COMMISSION';
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
  @Column({ type: 'varchar', length: 255 })
  @IsNotEmpty({ message: 'The name is required' })
  name!: string;

  @Field()
  @Column({ type: 'varchar', length: 35 })
  @IsNotEmpty({ message: 'The name is required' })
  type!: string;

  @Field()
  @Column({ type: 'text' })
  description?: string;

  @Field()
  @Column({ type: 'varchar', length: 4 })
  @IsNotEmpty({ message: 'The name is required' })
  since!: string;

  @Field()
  @Column({ type: 'varchar', length: 255, default: '' })
  facebook?: string;

  @Field()
  @Column({ type: 'varchar', length: 255, default: '' })
  instagram?: string;

  @Field()
  @Column({ type: 'varchar', length: 255, default: '' })
  whatsapp?: string;

  @Field()
  @Column({ type: 'varchar', length: 255, default: '' })
  linkedin?: string;

  @Field()
  @Column({ type: 'varchar', length: 255, default: '' })
  twitter?: string;

  @Field()
  @Column({ type: 'varchar', length: 255, default: '' })
  pinterest?: string;

  @Field()
  @Column({ type: 'varchar', length: 255, default: '' })
  tiktok?: string;

  @Field()
  @Column({ type: 'varchar', length: 255, default: '' })
  website?: string;

  @Field()
  @Column({ type: 'varchar', length: 255, default: '' })
  otherSocialLabel?: string;

  @Field()
  @Column({ type: 'varchar', length: 255, default: '' })
  otherSocialLink?: string;

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

  @Field()
  @Column({ type: 'float' })
  lat!: number;

  @Field()
  @Column({ type: 'float' })
  lng!: number;

  @Field()
  @Column({ type: 'varchar', length: 255, default: '' })
  phone?: string;

  @Field()
  @Column({ type: 'varchar', length: 255, default: '' })
  phone_2?: string;

  @Field()
  @Column({ type: 'varchar', length: 66 })
  rna?: string;

  @Field()
  @Column({ type: 'varchar', length: 14 })
  siret?: string;

  @ManyToOne(() => User, (user) => user.places)
  @IsNotEmpty()
  owner!: User;

  @OneToMany(() => Product, (product) => product.place)
  products?: Product[];

  @ManyToOne(() => Category, (category) => category.places)
  category?: Category;

  @ManyToMany(() => Tag, (tag) => tag.places)
  @JoinTable({ name: 'place_has_tags' })
  tags?: Tag[];

  @OneToMany(() => Upload, (upload) => upload.place)
  uploads?: Upload[];

  // @OneToMany(() => Service, (service) => service.place)
  // services?: Service[];

  // @OneToOne(() => Schedules)
  // @JoinColumn()
  // schedules?: Schedules;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt!: Date;

  // @OneToOne(() => ContactInformation)
  // @JoinColumn()
  // contact_information!: ContactInformation;
}
