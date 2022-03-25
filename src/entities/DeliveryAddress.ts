import { Field, ID, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Customer } from "./Customer";

@ObjectType()
@Entity()
export class DeliveryAddress extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  readonly id: number;

  @Field()
  @Column()
  customerName: string;

  @Field()
  @Column()
  customerContactNumber: string;

  @Field()
  @Column()
  street: string;

  @Field()
  @Column()
  barangay: string;

  @Field()
  @Column()
  town: string;

  @Field()
  @Column()
  province: string;

  @Field()
  @Column()
  isDefault: boolean;

  @Field(() => Customer)
  @ManyToOne(() => Customer, (customer) => customer.deliveryAddresses)
  customer: Customer;

  @Field(() => String)
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => String)
  @UpdateDateColumn()
  updatedAt: Date;
}
