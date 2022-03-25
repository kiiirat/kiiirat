import { ProductCategory, ProductUnit } from "../types";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { ProductEntry } from "./ProductEntry";
import { Field, ID, ObjectType } from "type-graphql";
import { Rating } from "./Rating";

@ObjectType()
@Entity()
export class Product extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id!: number;

  @Field()
  @Index()
  @Column({ unique: true })
  name!: string;

  @Field()
  @Column()
  imageUrl!: string;

  @Field(() => ProductCategory)
  @Column({
    type: "enum",
    enum: ProductCategory,
  })
  category!: ProductCategory;

  @Field(() => ProductUnit)
  @Column({ type: "enum", enum: ProductUnit })
  unit!: ProductUnit;

  @Field(() => [Rating])
  @OneToMany(() => Rating, (rating) => rating.product)
  ratings: Rating[];

  @Field(() => [ProductEntry])
  @OneToMany(() => ProductEntry, (entry) => entry.product)
  entries!: ProductEntry[];

  @Field(() => String)
  @CreateDateColumn()
  createdAt!: Date;

  @Field(() => String)
  @UpdateDateColumn()
  updatedAt!: Date;
}
