import { Field, InputType, ObjectType } from 'type-graphql';
import {
  Entity,
  BaseEntity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  ManyToMany,
  JoinTable, OneToMany
} from "typeorm";
import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { Category } from './Category';
import { Place } from './Place';
import { Tag } from './Tag';
import { Upload } from "./Upload";

@ObjectType('Product')
@InputType('ProductInput')
@Entity()
export class Product extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Field()
  @Column({ type: 'varchar', length: 255 })
  @IsNotEmpty({ message: 'The name is required' })
  name!: string;

  @Field()
  @Column({ type: 'int' })
  @IsNumber()
  @IsNotEmpty({ message: 'The price is required' })
  price!: number;

  @Field()
  @Column({ type: 'varchar', length: 255 })
  @IsOptional()
  ref?: string;

  @ManyToOne(() => Category, (category) => category.products)
  category!: Category;

  @ManyToOne(() => Place, (place) => place.products)
  place!: Place;

  @ManyToMany(() => Tag, (tag) => tag.places)
  @JoinTable({ name: 'product_has_tags' })
  tags?: Tag[];

  @OneToMany(() => Upload, (upload) => upload.product)
  uploads?: Upload[];

  @CreateDateColumn({ type: 'timestamp' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt!: Date;
}
