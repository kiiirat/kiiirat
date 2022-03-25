import { Order } from "../entities/Order";
import { Arg, Field, InputType, Mutation, Query, Resolver } from "type-graphql";
import { OrderInput, OrderResponse } from "./types/order";
import moment from "moment";
import { Customer } from "../entities/Customer";
import { OrderItem } from "../entities/OrderItems";
import { getRandomString } from "../utils/getRandomString";
import { OrderStatus } from "../types";
import { Brackets, getRepository, Like } from "typeorm";

@Resolver(Order)
export class OrderResolver {
  @Query(() => [Order], { nullable: true })
  async orders(
    @Arg("customerId", { nullable: true }) customerId: number,
    @Arg("status", { nullable: true }) status: string,
    @Arg("searchString", { nullable: true }) searchString: string
  ) {
    let query = getRepository(Order).createQueryBuilder("order");

    if (customerId && status && searchString) {
      query
        .where("order.customerId = :customerId", { customerId })
        .andWhere("order.status = :status", { status })
        .andWhere(
          new Brackets((qb) => {
            qb.where("order.referenceNumber like :searchString", {
              searchString: `%${searchString}%`,
            }).orWhere("order.customerName like :searchString", {
              searchString: `%${searchString}%`,
            });
          })
        );
    } else if (customerId && status) {
      query
        .where("order.customerId = :customerId", { customerId })
        .andWhere("order.status = :status", { status });
    } else if (customerId && searchString) {
      query.where("order.customerId = :customerId", { customerId }).andWhere(
        new Brackets((qb) => {
          qb.where("order.referenceNumber like :searchString", {
            searchString: `%${searchString}%`,
          }).orWhere("order.customerName like :searchString", {
            searchString: `%${searchString}%`,
          });
        })
      );
    } else if (status && searchString) {
      query.where("order.status = :status", { status }).andWhere(
        new Brackets((qb) => {
          qb.where("order.referenceNumber like :searchString", {
            searchString: `%${searchString}%`,
          }).orWhere("order.customerName like :searchString", {
            searchString: `%${searchString}%`,
          });
        })
      );
    } else if (customerId) {
      query.where("order.customerId = :customerId", { customerId });
    } else if (status) {
      query.where("order.status = :status", { status: status });
    } else if (searchString) {
      query.where(
        new Brackets((qb) => {
          qb.where("order.referenceNumber like :searchString", {
            searchString: `%${searchString}%`,
          }).orWhere("order.customerName like :searchString", {
            searchString: `%${searchString}%`,
          });
        })
      );
    }

    return query
      .leftJoinAndSelect("order.items", "items")
      .orderBy("order.createdAt", "DESC")
      .getMany();
  }

  @Mutation(() => Order)
  async createOrder(@Arg("options") options: OrderInput) {
    let date = moment().format("YYYYMMDD");
    let randomString = getRandomString(6);

    const customer = await Customer.findOne(options.customerId, {
      relations: ["profile"],
    });

    let orderItems: OrderItem[] = [];

    await Promise.all(
      options.items.map(async (item) => {
        let orderItem = await OrderItem.create(item).save();
        return orderItems.push(orderItem);
      })
    );

    const order = await Order.create({
      referenceNumber: date + randomString,
      items: orderItems,
      paymentMethod: options.paymentMethod,
      customer,
      shippingFee: 50,
      deliveryAddress: options.deliveryAddress,
      contactNumber: options.contactNumber,
      customerName: options.customerName,
    }).save();

    return order;
  }

  @Mutation(() => OrderResponse)
  async updateOrderStatus(
    @Arg("orderStatus", () => OrderStatus) status: OrderStatus,
    @Arg("orderId") id: number
  ): Promise<OrderResponse> {
    const order = await Order.findOne(id, { relations: ["items"] });
    order!["status"] = status;

    if (!order) {
      return {
        errors: [
          {
            field: "Order ID",
            message: "No order found with the give id",
          },
        ],
      };
    }

    await order.save();
    return {
      order,
    };
  }
}
