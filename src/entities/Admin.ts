import { IsEmail, MinLength } from "class-validator";
import { Field, ID, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Profile } from "./Profile";

@ObjectType()
@Entity()
export class Admin extends BaseEntity {
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

  @OneToOne(() => Profile)
  @JoinColumn()
  profile!: Profile;

  @Field(() => String)
  @CreateDateColumn()
  createdAt!: Date;

  @Field(() => String)
  @UpdateDateColumn()
  updatedAt!: Date;
}
