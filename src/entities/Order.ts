import { OrderStatus } from "../types";
import { Field, ID, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Customer } from "./Customer";
import { OrderItem } from "./OrderItems";

@ObjectType()
@Entity()
export class Order extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  readonly id: number;

  @Field()
  @Column()
  customerName: string;

  @Field()
  @Column()
  referenceNumber: string;

  @Field(() => [OrderItem])
  @OneToMany(() => OrderItem, (orderItem) => orderItem.order)
  items: OrderItem[];

  @Field()
  @Column()
  shippingFee?: number;

  @Field()
  @Column()
  paymentMethod: string;

  @Field()
  @Column()
  deliveryAddress: string;

  @Field()
  @Column()
  contactNumber: string;

  @Field(() => OrderStatus)
  @Column({
    type: "enum",
    enum: OrderStatus,
    default: "Pending",
  })
  status: OrderStatus;

  @Field(() => Customer)
  @ManyToOne(() => Customer, (customer) => customer.orders)
  customer: Customer;

  @Field(() => Date)
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => String)
  @UpdateDateColumn()
  updatedAt: Date;
}
