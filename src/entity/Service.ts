import { Field, InputType, ObjectType } from 'type-graphql';
import {
  Entity,
  BaseEntity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn, ManyToOne,
} from 'typeorm';
import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { Category } from './Category';
import { Shop } from './Shop';

@ObjectType('Service')
@InputType('ServiceInput')
@Entity()
export class Service extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Field()
  @Column({ type: 'varchar', length: 255 })
  @IsNotEmpty({ message: 'The name is required' })
  name!: string;

  @Field()
  @Column({ type: 'number' })
  @IsNumber()
  @IsNotEmpty({ message: 'The price is required' })
  price!: number;

  @Field()
  @Column({ type: 'varchar', length: 255 })
  @IsOptional()
  ref?: string;

  @ManyToOne(() => Category, (category) => category.services)
  category!: Category;

  @ManyToOne(() => Shop, (shop) => shop.services)
  shop!: Shop;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt!: Date;
}
