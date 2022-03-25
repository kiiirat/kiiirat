import { Order } from "../../entities/Order";
import { Field, InputType, ObjectType } from "type-graphql";
import { FieldError } from "./fieldError";

@InputType()
export class OrderItemsInput {
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
}

@InputType()
export class OrderInput {
  @Field()
  customerId: number;

  @Field()
  customerName: string;

  @Field()
  paymentMethod: string;

  @Field()
  deliveryAddress: string;

  @Field()
  contactNumber: string;

  @Field(() => [OrderItemsInput])
  items: OrderItemsInput[];
}

@ObjectType()
export class OrderResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => Order, { nullable: true })
  order?: Order;
}
