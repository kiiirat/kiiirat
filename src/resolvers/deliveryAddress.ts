import { Customer } from "../entities/Customer";
import { Arg, Mutation, Query, Resolver } from "type-graphql";
import { DeliveryAddress } from "../entities/DeliveryAddress";
import {
  DeliveryAddressInput,
  UpdateDeliveryAddressInput,
} from "./types/deliveryAddress";

@Resolver(DeliveryAddress)
export class DeliveryAddressResolver {
  @Query(() => [DeliveryAddress])
  async deliveryAddresses(
    @Arg("customerId", { nullable: true }) customerId: number
  ): Promise<DeliveryAddress[]> {
    return DeliveryAddress.find({
      ...(customerId && { where: { customer: customerId } }),
    });
  }

  @Mutation(() => DeliveryAddress)
  async createDeliveryAddress(
    @Arg("options") options: DeliveryAddressInput
  ): Promise<DeliveryAddress> {
    const customer = await Customer.findOne(options.customerId);
    const deliveryAddress = await DeliveryAddress.create({
      customerName: options.customerName,
      customerContactNumber: options.customerContactNumber,
      street: options.street,
      barangay: options.barangay,
      town: options.town,
      province: options.province,
      customer,
      isDefault: false,
    }).save();

    return deliveryAddress;
  }

  @Mutation(() => DeliveryAddress)
  async updateDeliveryAddress(
    @Arg("options") options: UpdateDeliveryAddressInput
  ): Promise<DeliveryAddress> {
    const deliveryAddress = await DeliveryAddress.findOne(
      options.deliveryAddressId
    );

    (deliveryAddress!.customerName = options.customerName),
      (deliveryAddress!.customerContactNumber = options.customerContactNumber);
    deliveryAddress!.street = options.street;
    deliveryAddress!.barangay = options.barangay;
    deliveryAddress!.town = options.town;
    deliveryAddress!.province = options.province;

    await deliveryAddress?.save();

    return deliveryAddress!;
  }

  @Mutation(() => Boolean)
  async deleteDeliveryAddress(
    @Arg("deliveryAddressId") deliveryAddressId: number,
    @Arg("customerId") customerId: number
  ) {
    const customer = await Customer.findOne(customerId, {
      relations: ["deliveryAddresses"],
    });

    const deliveryAddresses = customer!.deliveryAddresses;

    const dIndex = deliveryAddresses?.findIndex(
      (el) => el.id === deliveryAddressId
    ) as number;

    deliveryAddresses?.splice(dIndex, 1);

    customer!.deliveryAddresses = deliveryAddresses;

    await customer?.save();

    await DeliveryAddress.delete(deliveryAddressId);

    return true;
  }
}
