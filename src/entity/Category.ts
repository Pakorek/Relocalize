import { Field, InputType, ObjectType } from 'type-graphql';
import {
  Entity,
  BaseEntity,
  Column,
  PrimaryGeneratedColumn, OneToMany,
} from 'typeorm';
import { IsNotEmpty } from 'class-validator';
import { Product } from './Product';
import { Service } from './Service';

@ObjectType('Category')
@InputType('CategoryInput')
@Entity()
export class Category extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Field()
  @Column({ unique: true, type: 'varchar', length: 255 })
  @IsNotEmpty({ message: 'The name is required' })
  name!: string;

  @OneToMany(() => Product, (product) => product.category)
  products?: Product[];

  @OneToMany(() => Service, (service) => service.category)
  services?: Service[]
}
