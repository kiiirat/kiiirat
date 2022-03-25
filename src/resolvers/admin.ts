import { Admin } from "../entities/Admin";
import { Profile } from "../entities/Profile";
import {
  Arg,
  Ctx,
  Field,
  InputType,
  Int,
  Mutation,
  ObjectType,
  Query,
  Resolver,
} from "type-graphql";
import argon2 from "argon2";
import jwt from "jsonwebtoken";
import { Gender, MyContext } from "../types";
import { decodeAuthHeader } from "../utils/auth";

@InputType()
export class CreateAdminInput {
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

  @Field()
  contactNumber: string;
}

@InputType()
export class AdminSigninInput {
  @Field()
  email: string;

  @Field()
  password: string;
}

@ObjectType()
export class AdminResponse {
  @Field(() => Int)
  code: number;

  @Field()
  success: boolean;

  @Field()
  message: string;

  @Field(() => Admin, { nullable: true })
  admin?: Admin | null;

  @Field(() => String, { nullable: true })
  token?: string | null;
}

@Resolver(Admin)
export class AdminResolver {
  @Query(() => AdminResponse, { nullable: true })
  async authAdmin(@Ctx() { req }: MyContext): Promise<AdminResponse> {
    try {
      if (!req.headers.authorization) {
        return {
          code: 401,
          success: false,
          message: "Authentication failed! Pleae signin and comeback",
          admin: null,
        };
      }

      const { adminId } = decodeAuthHeader(req.headers.authorization);

      const admin = await Admin.findOne(adminId);

      return {
        code: 200,
        success: true,
        message: " Your are currently signed in!",
        admin,
      };
    } catch (err) {
      return {
        code: 500,
        success: false,
        message: err.message || err,
        admin: null,
      };
    }
  }

  @Query(() => [Admin], { nullable: true })
  async admins() {
    return Admin.find();
  }

  @Mutation(() => AdminResponse)
  async createAdmin(
    @Arg("options") options: CreateAdminInput
  ): Promise<AdminResponse> {
    try {
      const { firstName, lastName, email, contactNumber, password, gender } =
        options;
      const profile = await Profile.create({
        firstName,
        lastName,
        contactNumber,
        gender,
      }).save();
      const hashPassword = await argon2.hash(password);
      const admin = await Admin.create({
        email,
        password: hashPassword,
        profile,
      }).save();

      return {
        code: 201,
        success: true,
        message: "Admin has been successfully created!",
        admin,
      };
    } catch (error) {
      console.log(error);
      return {
        code: 500,
        success: false,
        message: error.message || error,
        admin: null,
      };
    }
  }

  @Mutation(() => AdminResponse)
  async adminSignin(
    @Arg("options") options: AdminSigninInput
    // @Ctx() { req }: MyContext
  ): Promise<AdminResponse> {
    try {
      const { email, password } = options;
      const admin = await Admin.findOne({ where: { email } });
      if (!admin) {
        throw new Error("Email is incorrect");
      }
      const passwordValid = await argon2.verify(admin.password, password);
      if (!passwordValid) {
        throw new Error("Password is incorrect");
      }

      const token = jwt.sign(
        {
          adminId: admin.id,
        },
        process.env.APP_SECRET,
        {
          expiresIn: "24h",
        }
      );

      return {
        code: 200,
        success: true,
        message: "Signin successful",
        admin,
        token,
      };
    } catch (error) {
      if (
        error.message === "Email is incorrect" ||
        error.message === "Password is incorrect"
      ) {
        return {
          code: 401,
          success: false,
          message: error.message,
          admin: null,
        };
      }

      return {
        code: 500,
        success: false,
        message: error.message || error,
        admin: null,
      };
    }
  }

  @Mutation(() => AdminResponse)
  adminSignout(@Ctx() { req, res }: MyContext): Promise<AdminResponse> {
    return new Promise((resolve) =>
      req.session.destroy((err) => {
        res.clearCookie("qid");
        if (err) {
          console.log(err);
          resolve({
            code: 500,
            success: false,
            message: err.message || err,
            admin: null,
          });
        }

        resolve({
          code: 200,
          success: true,
          message: "Signout successful",
          admin: null,
        });
      })
    );
  }
}
