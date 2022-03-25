import { Profile } from "../entities/Profile";
import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";
import argon2 from "argon2";
import jwt from "jsonwebtoken";
import { AuthTokenPayload, MyContext } from "../types";
import { Customer } from "../entities/Customer";
import {
  CustomerResponse,
  CustomerSigninInput,
  CustomerSignupInput,
  UpdateCustomerInput,
} from "./types/customer";
import { DeliveryAddress } from "../entities/DeliveryAddress";
import { Brackets, getRepository } from "typeorm";
import { Cart } from "../entities/Cart";

@Resolver(Customer)
export class CustomerResolver {
  @Query(() => Customer, { nullable: true })
  authCustomer(@Ctx() { req }: MyContext) {
    try {
      if (!req.headers.authorization) {
        return null;
      }
      const token = req.headers.authorization.replace("Bearer ", "");

      const { customerId } = jwt.verify(
        token,
        process.env.APP_SECRET
      ) as AuthTokenPayload;
      if (!customerId) {
        return null;
      }
      return Customer.findOne(customerId);
    } catch (error) {
      return null;
    }
  }

  @Query(() => [Customer], { nullable: true })
  async customers(
    @Arg("searchString", { nullable: true }) searchString: string
  ) {
    let query = getRepository(Customer)
      .createQueryBuilder("customer")
      .leftJoinAndSelect("customer.profile", "profile")
      .leftJoinAndSelect("customer.deliveryAddresses", "deliveryAddresses");

    if (searchString) {
      query
        .where(
          "CONCAT(profile.firstName, ' ', profile.lastName) like :searchString",
          { searchString: `%${searchString}%` }
        )
        .orWhere("customer.email like :searchString", {
          searchString: `%${searchString}%`,
        })
        .orWhere("profile.contactNumber like :searchString", {
          searchString: `%${searchString}%`,
        });
    }

    return query.getMany();
  }

  @Query(() => Customer, { nullable: true })
  async customer(@Arg("idOrEmail") idOrEmail: string) {
    return Customer.findOne(
      idOrEmail.includes("@")
        ? { where: { email: idOrEmail } }
        : { where: { id: parseFloat(idOrEmail) } }
    );
  }

  @Mutation(() => CustomerResponse)
  async customerSignup(
    @Arg("options") options: CustomerSignupInput
  ): Promise<CustomerResponse> {
    const {
      firstName,
      lastName,
      email,
      contactNumber,
      password,
      gender,
      address,
    } = options;

    const customerExist = await Customer.findOne({
      where: { email },
      relations: ["profile", "cart", "deliveryAddresses"],
    });

    if (customerExist) {
      return {
        errors: [
          {
            field: "email",
            message: "Email is already in use",
          },
        ],
      };
    }

    const profile = await Profile.create({
      firstName,
      lastName,
      contactNumber,
      gender,
    }).save();

    const cart = await Cart.create({
      items: "[]",
    }).save();

    const deliveryAddress = await DeliveryAddress.create({
      customerName: firstName + " " + lastName,
      customerContactNumber: contactNumber,
      street: address.street,
      barangay: address.barangay,
      town: address.town,
      province: address.province,
      isDefault: true,
    }).save();

    const hashPassword = await argon2.hash(password);
    const customer = await Customer.create({
      email,
      password: hashPassword,
      profile,
      cart,
      deliveryAddresses: [deliveryAddress],
    }).save();

    const token = jwt.sign(
      {
        customerId: customer.id,
      },
      process.env.APP_SECRET,
      {
        expiresIn: "24h",
      }
    );

    return {
      customer,
      token,
    };
  }

  @Mutation(() => CustomerResponse)
  async customerSignin(
    @Arg("options") options: CustomerSigninInput
    // @Ctx() { req }: MyContext
  ): Promise<CustomerResponse> {
    const { email, password } = options;
    const customer = await Customer.findOne({
      where: { email },
      relations: ["profile", "deliveryAddresses", "cart"],
    });
    if (!customer) {
      return {
        errors: [
          {
            field: "email",
            message: "Email is incorrect",
          },
        ],
      };
    }
    const passwordValid = await argon2.verify(customer.password, password);
    if (!passwordValid) {
      return {
        errors: [
          {
            field: "password",
            message: "Password is incorrect",
          },
        ],
      };
    }

    const token = jwt.sign(
      {
        customerId: customer.id,
      },
      process.env.APP_SECRET,
      {
        expiresIn: "24h",
      }
    );

    return {
      customer,
      token,
    };
  }

  @Mutation(() => CustomerResponse)
  async updateCustomer(
    @Arg("options") options: UpdateCustomerInput
  ): Promise<CustomerResponse> {
    const customer = await Customer.findOne(options.customerId, {
      relations: ["profile", "deliveryAddresses", "cart"],
    });

    const profile = await Profile.findOne(customer?.profile.id);

    if (!customer) {
      return {
        errors: [
          {
            field: "Customer ID",
            message: "No customer found with the given id",
          },
        ],
      };
    }
    try {
      for (const [updateKey, updateValue] of Object.entries(options)) {
        if (updateKey === "email") {
          (customer as any)[updateKey] = updateValue;
        }

        (profile as any)[updateKey] = updateValue;
      }
    } catch (err) {
      console.log(err);
    }

    await profile?.save();
    customer.profile = profile!;
    await customer.save();

    return {
      customer,
    };
  }

  @Mutation(() => Boolean)
  async customerChangePassword(
    @Arg("email") email: string,
    @Arg("password") password: string
  ) {
    try {
      const customer = await Customer.findOne({ where: { email } });
      customer!.password = await argon2.hash(password);
      await customer?.save();
      return true;
    } catch (err) {
      console.log(err);
      return false;
    }
  }
}
