import { Authorized, Field, InputType, ObjectType } from 'type-graphql';
import {
  Entity,
  BaseEntity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn
} from 'typeorm';
import { IsAlpha, IsAlphanumeric, IsNotEmpty, IsOptional } from 'class-validator';
import { PROFESSIONAL_AREA } from './Shop';


@ObjectType('Prospect')
@InputType('ProspectInput')
@Entity()
export class Prospect extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Field()
  @Column({ type: 'varchar', length: 35 })
  @IsNotEmpty({ message: 'The name is required' })
  name!: string;

  @Field()
  @Column({ type: 'varchar', length: 255 })
  @IsNotEmpty({ message: 'The professional area is required' })
  typeOf!: PROFESSIONAL_AREA;

  @Field()
  @Column({ type: 'varchar', length: 35 })
  @IsAlphanumeric()
  @IsNotEmpty()
  address_1!: string;

  @Field()
  @Column({ type: 'varchar', length: 35 })
  @IsAlphanumeric()
  @IsOptional()
  address_2?: string;

  @Field()
  @Column({ type: 'varchar', length: 35 })
  @IsAlphanumeric()
  @IsOptional()
  address_3?: string;

  @Field()
  @Column({ type: 'varchar', length: 35 })
  @IsAlpha()
  @IsNotEmpty({ message: 'The city is required' })
  city!: string;

  @Field()
  @Column({ type: 'varchar', length: 70 })
  @IsAlpha()
  @IsNotEmpty({ message: 'The country is required' })
  country!: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt!: Date;
}
