import { Product } from "../entities/Product";
import { Arg, Field, InputType, Mutation, Query, Resolver } from "type-graphql";
import { ProductCategory, ProductUnit } from "../types";
import { ProductEntry } from "../entities/ProductEntry";
import { ProductVariation } from "../entities/ProductVariation";
import { UserInputError } from "apollo-server-core";
import { Rating } from "../entities/Rating";
import { getRepository, ILike, Like } from "typeorm";

@InputType()
export class CreateProductInputVariation {
  @Field()
  name: string;

  @Field()
  price: string;
}

@InputType()
export class UpdateProductInputVariation {
  @Field()
  name: string;

  @Field()
  price: number;
}

@InputType()
export class CreateProductInput {
  @Field()
  name: string;

  @Field()
  imageUrl: string;

  @Field(() => ProductUnit)
  unit: ProductUnit;

  @Field(() => ProductCategory)
  category: ProductCategory;

  @Field(() => [CreateProductInputVariation])
  variations: CreateProductInputVariation[];
}

@InputType()
export class UpdateProductInput {
  @Field()
  id: number;

  @Field()
  name: string;

  @Field()
  imageUrl: string;

  @Field(() => ProductUnit)
  unit: ProductUnit;

  @Field(() => ProductCategory)
  category: ProductCategory;

  @Field(() => [UpdateProductInputVariation])
  variations: UpdateProductInputVariation[];
}

@Resolver(Product)
export class ProductResolver {
  @Query(() => [Product])
  products(
    @Arg("category", { nullable: true }) category: string,
    @Arg("searchString", { nullable: true }) searchString: string
  ) {
    return Product.find({
      where: {
        ...(category && { category }),
        ...(searchString && { name: Like(`%${searchString}%`) }),
      },
      relations: ["entries", "entries.variation"],
    });
  }

  @Query(() => [Product])
  getLatestProducts() {
    return Product.find({
      relations: ["entries", "entries.variation"],
      order: {
        createdAt: "DESC",
      },
      take: 5,
    });
  }

  @Query(() => Product)
  product(@Arg("id") productId: number) {
    return Product.findOne(productId, {
      relations: ["entries", "entries.variation", "ratings"],
    });
  }

  @Mutation(() => Product)
  async createProduct(
    @Arg("options") options: CreateProductInput
  ): Promise<Product> {
    const { name, unit, category, variations, imageUrl } = options;
    const product = await Product.create({
      name,
      unit,
      category,
      imageUrl,
    }).save();

    variations.map(async (variation, index) => {
      const productVariation = await ProductVariation.create({
        name: variation.name,
        default: index === 0 ? true : false,
      }).save();

      await ProductEntry.create({
        product,
        price: parseInt(variation.price),
        variation: productVariation,
      }).save();
    });

    return product;
  }

  @Mutation(() => Product)
  async updateProduct(
    @Arg("options") options: UpdateProductInput
  ): Promise<Product> {
    const product = await Product.findOne(options.id, {
      relations: ["entries", "entries.variation"],
    });

    if (!product) {
      throw new UserInputError("Invalid product id");
    }

    product.name = options.name;
    product.imageUrl = options.imageUrl;
    product.category = options.category;

    await product.save();

    await Promise.all(
      options.variations.map(async (vrtn) => {
        const entry = await ProductEntry.findOne({
          where: { product: product, variation: { name: vrtn.name } },
          relations: ["variation"],
        });
        if (entry) {
          (entry.price = vrtn.price), (entry.variation.name = vrtn.name);
          await entry.save();
        } else {
          const pv = await ProductVariation.create({
            name: vrtn.name,
            default: false,
          }).save();
          await ProductEntry.create({
            product,
            price: vrtn.price,
            variation: pv,
          }).save();
        }
      })
    );
    return product;
  }

  @Mutation(() => Boolean)
  async deleteProduct(@Arg("id") id: number): Promise<Boolean> {
    const productEntries = await ProductEntry.find({
      where: { product: id },
      relations: ["variation"],
    });
    const ratings = await Rating.find({
      where: { product: id },
    });
    productEntries.map(async (ent) => {
      await ProductEntry.delete(ent.id);
      await ProductVariation.delete(ent.variation.id);
    });

    ratings.map(async (rt) => {
      await Rating.delete(rt.id);
    });

    await Product.delete(id);
    return true;
  }
}
