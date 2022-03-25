import { Cart, CartItemInputType } from "../entities/Cart";
import { Arg, Mutation, Query, Resolver } from "type-graphql";

@Resolver(Cart)
export class CartResolver {
  @Mutation(() => Boolean)
  async updateCart(
    @Arg("items", { nullable: true })
    items: string,
    @Arg("cartId") cartId: number
  ) {
    const cart = await Cart.findOne(cartId);

    cart!.items = items;

    await cart?.save();

    return true;
  }
}
