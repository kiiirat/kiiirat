import { Hello } from "../entities/Hello";
import { Arg, Mutation, Query, Resolver } from "type-graphql";

@Resolver(Hello)
export class HelloResolver {
  @Query(() => [Hello], { nullable: true })
  async hello() {
    return Hello.find();
  }

  @Mutation(() => Hello)
  async createSampleMessage(@Arg("message") message: string): Promise<Hello> {
    return Hello.create({
      message,
    }).save();
  }
}
