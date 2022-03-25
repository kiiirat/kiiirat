import { Rating } from "../entities/Rating";
import {
  Arg,
  Args,
  Field,
  InputType,
  Mutation,
  Query,
  Resolver,
} from "type-graphql";
import { CreateRateInput, GetRatingsReponse } from "./types/rating";
import { Customer } from "../entities/Customer";
import { Product } from "../entities/Product";
@InputType()
class RatingWhereUniqueInput {
  @Field({ nullable: true })
  customerId?: number;

  @Field({ nullable: true })
  productId?: number;
}

@Resolver(Rating)
export class RatingResolver {
  @Query(() => GetRatingsReponse, { nullable: true })
  async ratings(
    @Arg("productId", { nullable: true }) productId: number
  ): Promise<GetRatingsReponse> {
    const fiveStars = await Rating.find({
      where: { product: productId, stars: 5 },
      relations: ["customer", "customer.profile"],
    });

    const fourStars = await Rating.find({
      where: { product: productId, stars: 4 },
      relations: ["customer", "customer.profile"],
    });

    const threeStars = await Rating.find({
      where: { product: productId, stars: 3 },
      relations: ["customer", "customer.profile"],
    });

    const twoStars = await Rating.find({
      where: { product: productId, stars: 2 },
      relations: ["customer", "customer.profile"],
    });

    const oneStar = await Rating.find({
      where: { product: productId, stars: 1 },
      relations: ["customer", "customer.profile"],
    });

    return {
      fiveStars,
      fourStars,
      threeStars,
      twoStars,
      oneStar,
    };
  }

  @Query(() => [Rating], { nullable: true })
  async customerRatings(@Arg("customerId") customerId: number) {
    return Rating.find({
      where: {
        customer: {
          id: customerId,
        },
      },
      relations: ["product"],
    });
  }

  @Query(() => Rating, { nullable: true })
  async rating(
    @Arg("where", { nullable: true }) where: RatingWhereUniqueInput
  ) {
    return Rating.findOne({
      where: {
        customer: {
          id: where.customerId,
        },
        product: {
          id: where.productId,
        },
      },
    });
  }

  @Mutation(() => Rating)
  async createRating(@Arg("options") options: CreateRateInput) {
    const customer = await Customer.findOne(options.customerId);
    const product = await Product.findOne(options.productId);

    return Rating.create({
      comment: options.comment,
      stars: options.stars,
      product,
      customer,
    }).save();
  }
}
