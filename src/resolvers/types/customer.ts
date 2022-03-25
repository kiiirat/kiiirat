import { Customer } from "../../entities/Customer";
import { Gender } from "../../types";
import { ObjectType, Field, InputType } from "type-graphql";
import { FieldError } from "./fieldError";

@InputType()
class Address {
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
export class CustomerSignupInput {
  @Field()
  email: string;

  @Field()
  password: string;

  @Field()
  firstName: string;

  @Field()
  lastName: string;

  @Field(() => Gender)
  gender: Gender;

  @Field(() => Address)
  address: Address;

  @Field()
  contactNumber: string;
}

@InputType()
export class CustomerSigninInput {
  @Field()
  email: string;

  @Field()
  password: string;
}

@ObjectType()
export class CustomerResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => Customer, { nullable: true })
  customer?: Customer;

  @Field({ nullable: true })
  token?: string;
}

@InputType()
export class UpdateCustomerInput {
  @Field()
  customerId: number;

  @Field()
  email: string;

  @Field()
  firstName: string;

  @Field()
  lastName: string;

  @Field(() => Gender)
  gender: Gender;

  @Field()
  contactNumber: string;

  @Field()
  profileImage: string;
}
