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
  JoinTable,
  OneToMany,
  BeforeInsert,
  JoinColumn,
} from 'typeorm';
import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { Category } from './Category';
import { Place } from './Place';
import { Tag } from './Tag';
import { Upload } from './Upload';

@ObjectType('Product')
@InputType('ProductInput')
@Entity()
export class Product extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field()
  id!: number;

  @Field()
  @Column({ type: 'varchar', length: 50 })
  @IsNotEmpty({ message: 'The title is required' })
  title!: string;

  @Field()
  @Column({ type: 'varchar', length: 120 })
  subtitle?: string;

  @Field()
  @Column({ type: 'int' })
  @IsNumber()
  @IsNotEmpty({ message: 'The price is required' })
  price!: number;

  @Field()
  @Column({ type: 'text' })
  @IsNotEmpty({ message: 'The description is required' })
  description!: string;

  @Field()
  @Column({ type: 'varchar', length: 255 })
  @IsOptional()
  quantitative?: string;

  @Field()
  @Column({ type: 'varchar', length: 255 })
  @IsOptional()
  reference?: string;

  @Column({ type: 'int' })
  @Field()
  place_id!: number;

  @Column({ type: 'int' })
  @Field()
  category_id!: number;

  @ManyToOne(() => Category, (category) => category.products)
  @JoinColumn({ name: 'category_id', referencedColumnName: 'id' })
  @Field(() => Category)
  category?: Category;

  @ManyToOne(() => Place, (place) => place.products)
  @JoinColumn({ name: 'place_id', referencedColumnName: 'id' })
  @Field(() => Place)
  place!: Place;

  @ManyToMany(() => Tag, (tag) => tag.products)
  @JoinTable({
    name: 'product_has_tags',
    joinColumn: {
      name: 'product_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'tag_id',
      referencedColumnName: 'id',
    },
  })
  @Field(() => [Tag])
  tags?: Tag[];

  @OneToMany(() => Upload, (upload) => upload.product)
  uploads?: Upload[];

  @CreateDateColumn({ type: 'timestamp' })
  created_at!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at!: Date;

  @BeforeInsert()
  updateDates() {
    this.created_at = new Date();
  }
}
