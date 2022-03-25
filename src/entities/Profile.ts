import { Field, ID, ObjectType } from "type-graphql";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  CreateDateColumn,
  Index,
  UpdateDateColumn,
} from "typeorm";

import { Gender } from "../types";

@ObjectType()
@Entity()
export class Profile extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id!: number;

  @Field()
  @Index({ fulltext: true })
  @Column({ nullable: false })
  firstName!: string;

  @Field()
  @Index({ fulltext: true })
  @Column({ nullable: false })
  lastName!: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  profileImage: string;

  @Field(() => Gender)
  @Column({ type: "enum", enum: Gender, nullable: true })
  gender!: Gender;

  @Field()
  @Index()
  @Column({ nullable: false })
  contactNumber!: string;

  @Field(() => String)
  @CreateDateColumn()
  createdAt!: Date;

  @Field(() => String)
  @UpdateDateColumn()
  updatedAt!: Date;
}
