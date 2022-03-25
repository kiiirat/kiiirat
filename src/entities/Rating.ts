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
import { Product } from "./Product";

@ObjectType()
@Entity()
export class Rating extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  readonly id: number;

  @Field()
  @Column()
  comment: string;

  @Field()
  @Column()
  stars: number;

  @Field(() => Product)
  @ManyToOne(() => Product, (product) => product.ratings)
  product: Product;

  @Field(() => Customer)
  @ManyToOne(() => Customer, (customer) => customer.ratings)
  customer: Customer;

  @Field(() => String)
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => String)
  @UpdateDateColumn()
  updatedAt: Date;
}
