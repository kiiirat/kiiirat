import { Field, ID, InputType, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@InputType()
export class CartItemInputType {
  @Field(() => ID)
  id: string;

  @Field()
  productId: number;

  @Field()
  productName: string;

  @Field()
  productImage: string;

  @Field()
  productPrice: number;

  @Field()
  productVariation: string;

  @Field()
  quantity: number;

  @Field()
  isChecked: boolean;
}

@ObjectType()
export class CartItem {
  @Field(() => ID)
  id: string;

  @Field()
  productId: number;

  @Field()
  productName: string;

  @Field()
  productImage: string;

  @Field()
  productPrice: number;

  @Field()
  productVariation: string;

  @Field()
  quantity: number;

  @Field()
  isChecked: boolean;
}

@ObjectType()
@Entity()
export class Cart extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  readonly id: number;

  @Field({ nullable: true })
  @Column({ type: "text" })
  items: string;

  @Field(() => String)
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => String)
  @UpdateDateColumn()
  updatedAt: Date;
}
