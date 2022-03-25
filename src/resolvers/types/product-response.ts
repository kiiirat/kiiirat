import { ObjectType, Field } from "type-graphql";
import { FieldError } from "./fieldError";
import { Product } from "../../entities/Product";

@ObjectType()
export class ProductResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => Product, { nullable: true })
  product?: Product;
}
