import { Field, InputType, ObjectType } from 'type-graphql';
import {
  Entity,
  BaseEntity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne, BeforeInsert
} from "typeorm";
import { IsUrl } from 'class-validator';
import { Place } from './Place';
import { Product } from './Product';

@ObjectType('Image')
@InputType('ImageInput')
@Entity()
export class Image extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Field()
  @Column()
  @IsUrl()
  url!: string;

  @Field()
  @Column()
  filename?: string;

  @Field()
  @Column()
  description?: string;

  @CreateDateColumn({ type: 'timestamp' })
  created_at!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at!: Date;

  @ManyToOne(() => Place, (place) => place.images)
  place?: Place;

  @ManyToOne(() => Product, (product) => product.images)
  product?: Product;

  @BeforeInsert()
  updateDates() {
    this.created_at = new Date();
  }

}
