import { Field, InputType, ObjectType, registerEnumType } from "type-graphql";
import {
  Entity,
  BaseEntity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne, BeforeInsert, JoinColumn
} from "typeorm";
import { IsUrl } from "class-validator";
import { Place } from "./Place";
import { Product } from "./Product";
import { EntityTarget } from "./type/Image";

registerEnumType(EntityTarget, {
  name: 'EntityTarget',
});
@ObjectType("Image")
@InputType("ImageInput")
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
  public_id!: string;

  @Field()
  @Column()
  filename?: string;

  @Field()
  @Column()
  description?: string;

  @Field(() => EntityTarget)
  target?: EntityTarget;

  @Field()
  target_id?: number;

  @Column({ type: "int" })
  @Field()
  place_id?: number;

  @Column({ type: "int" })
  @Field()
  product_id?: number;

  @CreateDateColumn({ type: "timestamp" })
  created_at!: Date;

  @UpdateDateColumn({ type: "timestamp" })
  updated_at!: Date;

  @ManyToOne(() => Place, (place) => place.images)
  @JoinColumn({ name: "place_id", referencedColumnName: "id" })
  place?: Place;

  @ManyToOne(() => Product, (product) => product.images)
  @JoinColumn({ name: "product_id", referencedColumnName: "id" })
  product?: Product;

  @BeforeInsert()
  updateDates() {
    this.created_at = new Date();
  }
}
