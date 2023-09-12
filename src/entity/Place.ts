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
  JoinColumn,
  BeforeInsert,
} from 'typeorm';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { Product } from './Product';
import { User } from './User';
import { Category } from './Category';
import { Upload } from './Upload';
import { Tag } from './Tag';
import { Bookmark } from './Bookmark';

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
  @Field()
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
  other_social_label?: string;

  @Field()
  @Column({ type: 'varchar', length: 255, default: '' })
  other_social_link?: string;

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
  zip_code!: string;

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

  @Column({ type: 'int' })
  owner_id!: number;

  @Column({ type: 'int' })
  @Field()
  category_id!: number;

  @ManyToOne(() => User, (user) => user.places)
  @JoinColumn({ name: 'owner_id', referencedColumnName: 'id' })
  @Field(() => User)
  @IsNotEmpty()
  owner!: User;

  @ManyToOne(() => Category, (category) => category.places)
  @JoinColumn({ name: 'category_id', referencedColumnName: 'id' })
  @Field(() => Category)
  category?: Category;

  @OneToMany(() => Product, (product) => product.place)
  @Field(() => [Product])
  products?: Product[];

  @OneToMany(() => Bookmark, (bm) => bm.place)
  @Field(() => [Bookmark])
  bookmarks?: Bookmark[];

  @ManyToMany(() => Tag, (tag) => tag.places)
  @JoinTable({
    name: 'place_has_tags',
    joinColumn: {
      name: 'place_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'tag_id',
      referencedColumnName: 'id',
    },
  })
  @Field(() => [Tag])
  tags?: Tag[];

  @OneToMany(() => Upload, (upload) => upload.place)
  uploads?: Upload[];

  // @OneToMany(() => Service, (service) => service.place)
  // services?: Service[];

  // @OneToOne(() => Schedules)
  // @JoinColumn()
  // schedules?: Schedules;

  @CreateDateColumn({ type: 'timestamp' })
  created_at!: Date;

  @BeforeInsert()
  updateDates() {
    this.created_at = new Date();
  }

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at!: Date;

  // @OneToOne(() => ContactInformation)
  // @JoinColumn()
  // contact_information!: ContactInformation;
}
