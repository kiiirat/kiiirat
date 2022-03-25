import { IsEmail, MinLength } from "class-validator";
import { Field, ID, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Cart } from "./Cart";
import { DeliveryAddress } from "./DeliveryAddress";
import { Order } from "./Order";
import { Profile } from "./Profile";
import { Rating } from "./Rating";

@ObjectType()
@Entity()
export class Customer extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id!: number;

  @Field()
  @Index({ fulltext: true })
  @Column({ nullable: false })
  @IsEmail()
  email!: string;

  @Column({ nullable: false })
  @MinLength(6, {
    message: "Password length should be equal or greater than 6",
  })
  password!: string;

  @Field(() => Profile)
  @OneToOne(() => Profile)
  @JoinColumn()
  profile!: Profile;

  @Field(() => Cart)
  @OneToOne(() => Cart)
  @JoinColumn()
  cart: Cart;

  @Field(() => [DeliveryAddress])
  @OneToMany(
    () => DeliveryAddress,
    (deliveryAddress) => deliveryAddress.customer
  )
  deliveryAddresses: DeliveryAddress[];

  @Field(() => [Order])
  @OneToMany(() => Order, (order) => order.customer)
  orders: Order[];

  @Field(() => [Rating])
  @OneToMany(() => Rating, (rating) => rating.customer)
  ratings: Rating[];

  @Field(() => String)
  @CreateDateColumn()
  createdAt!: Date;

  @Field(() => String)
  @UpdateDateColumn()
  updatedAt!: Date;
}
