import { Field, InputType, ObjectType } from 'type-graphql';
import {
  Entity,
  BaseEntity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { IsNotEmpty } from 'class-validator';
import { Product } from './Product';
import { Place } from './Place';
import { User } from './User';

@ObjectType('Bookmark')
@InputType('BookmarkInput')
@Entity()
export class Bookmark extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  @Field()
  owner_id!: number;

  @Column()
  @Field()
  place_id?: number;

  @Column()
  @Field()
  product_id?: number;

  @ManyToOne(() => User, (user) => user.bookmarks)
  @JoinColumn({ name: 'owner_id', referencedColumnName: 'id' })
  @Field(() => User)
  @IsNotEmpty({ message: 'The owner is required' })
  owner!: string;

  @ManyToOne(() => Place, (place) => place.bookmarks)
  @JoinColumn({ name: 'place_id', referencedColumnName: 'id' })
  @Field(() => Place)
  place?: Place;

  @ManyToOne(() => Product, (product) => product.bookmarks)
  @JoinColumn({ name: 'product_id', referencedColumnName: 'id' })
  @Field(() => Product)
  product?: Product;

  // @OneToMany(() => Service, (service) => service.category)
  // services?: Service[];
}
// @InputType('BookmarkInput')
// export class BookmarkInput extends BaseEntity {
//   @PrimaryGeneratedColumn()
//   id!: number;
//
//   @Column()
//   @Field()
//   owner_id!: number;
//
//   @Column()
//   @Field()
//   place_id?: number;
//
//   // @ManyToMany(() => Product, (product) => product.BookMarks)
//   // products?: Product[];
//
//   // @OneToMany(() => Service, (service) => service.category)
//   // services?: Service[];
// }
