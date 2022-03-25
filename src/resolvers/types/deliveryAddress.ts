import { InputType, Field } from "type-graphql";

@InputType()
export class DeliveryAddressInput {
  @Field()
  customerId: number;

  @Field()
  customerName: string;

  @Field()
  customerContactNumber: string;

  @Field()
  street: string;

  @Field()
  barangay: string;

  @Field()
  town: string;

  @Field()
  province: string;
}

@InputType()
export class UpdateDeliveryAddressInput {
  @Field()
  deliveryAddressId: number;

  @Field()
  customerName: string;

  @Field()
  customerContactNumber: string;

  @Field()
  street: string;

  @Field()
  barangay: string;

  @Field()
  town: string;

  @Field()
  province: string;
}
