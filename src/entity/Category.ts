import { Field, InputType, ObjectType } from 'type-graphql';
import {
  Entity,
  BaseEntity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany, ManyToOne, JoinColumn
} from "typeorm";
import { IsNotEmpty } from 'class-validator';
import { Product } from './Product';
import { Service } from './Service';
import { Place } from './Place';

@ObjectType('Category')
@InputType('CategoryInput')
@Entity()
export class Category extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field()
  id!: number;

  @Field()
  @Column({ unique: true, type: 'varchar', length: 255 })
  @IsNotEmpty({ message: 'The label is required' })
  label!: string;

  @Field()
  @Column()
  place_type?: string;

  @Column()
  parent_id?: number;

  @ManyToOne(() => Category, (category) => category.childs)
  @JoinColumn({ name: 'parent_id', referencedColumnName: 'id' })
  @Field(() => Category)
  parent?: Category | null;

  @OneToMany(() => Category, (category) => category.parent)
  @Field(() => [Category])
  childs?: Category[] | null;

  @OneToMany(() => Place, (place) => place.category)
  places?: Place[];

  @OneToMany(() => Product, (product) => product.category)
  products?: Product[];

  // @OneToMany(() => Service, (service) => service.category)
  // services?: Service[];
}
