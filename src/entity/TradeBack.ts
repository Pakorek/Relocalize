import { Field, InputType, ObjectType } from 'type-graphql';
import {
  Entity,
  BaseEntity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany, ManyToOne, JoinColumn
} from "typeorm";
import { IsNotEmpty } from 'class-validator';
import { Product } from './Product';
import { Place } from './Place';

@ObjectType('TradeBack')
@InputType('TradeBackInput')
@Entity()
export class TradeBack extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field()
  id!: number;

  @Field()
  @Column({ unique: true, type: 'varchar', length: 35 })
  @IsNotEmpty({ message: 'The label is required' })
  label!: string;

  @Column({ type: "int" })
  @Field()
  trade_id!: number;

  @ManyToOne(() => Product, (product) => product.trades_back)
  @JoinColumn({ name: "trade_id", referencedColumnName: "id" })
  trade!: Product;
}
