import { Rating } from "../../entities/Rating";
import { Field, InputType, ObjectType } from "type-graphql";

@InputType()
export class CreateRateInput {
  @Field()
  customerId: number;

  @Field()
  productId: number;

  @Field()
  comment: string;

  @Field()
  stars: number;
}

@ObjectType()
export class GetRatingsReponse {
  @Field(() => [Rating])
  fiveStars: Rating[];

  @Field(() => [Rating])
  fourStars: Rating[];

  @Field(() => [Rating])
  threeStars: Rating[];

  @Field(() => [Rating])
  twoStars: Rating[];

  @Field(() => [Rating])
  oneStar: Rating[];
}
