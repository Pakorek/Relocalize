import { Field, InputType, ObjectType } from 'type-graphql';
import { Entity, BaseEntity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { IsDate } from 'class-validator';

@ObjectType('Schedules')
@InputType('SchedulesInput')
@Entity()
export class Schedules extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Field()
  @Column()
  @IsDate()
  monday_am_from?: Date;

  @Field()
  @Column()
  @IsDate()
  monday_am_to?: Date;

  @Field()
  @Column()
  @IsDate()
  monday_pm_from?: Date;

  @Field()
  @Column()
  @IsDate()
  monday_pm_to?: Date;

  @Field()
  @Column()
  @IsDate()
  tuesday_am_from?: Date;

  @Field()
  @Column()
  @IsDate()
  tuesday_am_to?: Date;

  @Field()
  @Column()
  @IsDate()
  tuesday_pm_from?: Date;

  @Field()
  @Column()
  @IsDate()
  tuesday_pm_to?: Date;

  @Field()
  @Column()
  @IsDate()
  wednesday_am_from?: Date;

  @Field()
  @Column()
  @IsDate()
  wednesday_am_to?: Date;

  @Field()
  @Column()
  @IsDate()
  wednesday_pm_from?: Date;

  @Field()
  @Column()
  @IsDate()
  wednesday_pm_to?: Date;

  @Field()
  @Column()
  @IsDate()
  thursday_am_from?: Date;

  @Field()
  @Column()
  @IsDate()
  thursday_am_to?: Date;

  @Field()
  @Column()
  @IsDate()
  thursday_pm_from?: Date;

  @Field()
  @Column()
  @IsDate()
  thursday_pm_to?: Date;

  @Field()
  @Column()
  @IsDate()
  friday_am_from?: Date;

  @Field()
  @Column()
  @IsDate()
  friday_am_to?: Date;

  @Field()
  @Column()
  @IsDate()
  friday_pm_from?: Date;

  @Field()
  @Column()
  @IsDate()
  friday_pm_to?: Date;

  @Field()
  @Column()
  @IsDate()
  saturday_am_from?: Date;

  @Field()
  @Column()
  @IsDate()
  saturday_am_to?: Date;

  @Field()
  @Column()
  @IsDate()
  saturday_pm_from?: Date;

  @Field()
  @Column()
  @IsDate()
  saturday_pm_to?: Date;

  @Field()
  @Column()
  @IsDate()
  sunday_am_from?: Date;

  @Field()
  @Column()
  @IsDate()
  sunday_am_to?: Date;

  @Field()
  @Column()
  @IsDate()
  sunday_pm_from?: Date;

  @Field()
  @Column()
  @IsDate()
  sunday_pm_to?: Date;
}
