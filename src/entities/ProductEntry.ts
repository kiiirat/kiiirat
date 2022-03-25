import { Field, ID, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Product } from "./Product";

import { ProductVariation } from "./ProductVariation";

@ObjectType()
@Entity()
export class ProductEntry extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id!: number;

  @Field()
  @Column()
  price!: number;

  @ManyToOne(() => Product, (product) => product.entries)
  product!: Product;

  @Field(() => ProductVariation)
  @ManyToOne(() => ProductVariation, (variation) => variation.productEntries)
  variation!: ProductVariation;

  @Field(() => String)
  @CreateDateColumn()
  createdAt!: Date;

  @Field(() => String)
  @UpdateDateColumn()
  updatedAt!: Date;
}
