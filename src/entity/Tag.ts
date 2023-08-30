import { Field, InputType, ObjectType } from 'type-graphql';
import {
  Entity,
  BaseEntity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
} from 'typeorm';
import { IsNotEmpty } from 'class-validator';
import { Product } from './Product';
import { Place } from './Place';

@ObjectType('Tag')
@InputType('TagInput')
@Entity()
export class Tag extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Field()
  @Column({ unique: true, type: 'varchar', length: 35 })
  @IsNotEmpty({ message: 'The label is required' })
  label!: string;

  @Field()
  @Column({ unique: true, type: 'varchar', length: 255 })
  category?: string;

  @ManyToMany(() => Place, (place) => place.tags)
  places?: Place[];

  @ManyToMany(() => Product, (product) => product.tags)
  products?: Product[];

  // @OneToMany(() => Service, (service) => service.category)
  // services?: Service[];
}
