import { Matrix } from "../entities/Matrix";
import { Arg, Mutation, Query, Resolver, InputType, Field } from "type-graphql";
import { getRepository } from "typeorm";

@InputType()
export class CreateMatrixInputType {
  @Field()
  barangay: string;

  @Field()
  shippingFee: number;
}

@Resolver(Matrix)
export class MatrixResolver {
  @Query(() => [Matrix])
  async matrix(@Arg("searchString", { nullable: true }) searchString: string) {
    let query = getRepository(Matrix).createQueryBuilder("matrix");

    if (searchString) {
      query
        .where("TRIM(matrix.barangay) like :searchString", {
          searchString: `%${searchString}%`,
        })
        .orWhere("TRIM(matrix.shippingFee) like :searchString", {
          searchString: `%${searchString}%`,
        });
    }

    return query.getMany();
  }

  @Mutation(() => Boolean)
  async createMatrix(
    @Arg("options", () => [CreateMatrixInputType])
    options: [CreateMatrixInputType]
  ) {
    options.map(async (mat) => {
      await Matrix.create({
        barangay: mat.barangay,
        shippingFee: mat.shippingFee,
      }).save();
    });

    return true;
  }

  @Mutation(() => Matrix || null)
  async updateMatrix(
    @Arg("barangay") barangay: string,
    @Arg("shippingFee") shippingFee: string,
    @Arg("id") id: number
  ): Promise<Matrix | null> {
    const matrix = await Matrix.findOne(id);
    if (!matrix) {
      return null;
    }

    matrix.barangay = barangay;
    matrix.shippingFee = parseFloat(shippingFee);

    await matrix.save();

    return matrix;
  }

  @Mutation(() => Boolean)
  async deleteMatrix(@Arg("matrixId") matrixId: number) {
    await Matrix.delete(matrixId);
    return true;
  }
}
