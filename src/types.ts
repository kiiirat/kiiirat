import { Request, Response } from "express";
import { Session } from "express-session";
import { Redis } from "ioredis";

export type MyContext = {
  req: Request & {
    session?: Session & { adminId?: number; customerId?: number };
  };
  redis: Redis;
  res: Response;
};

export type UserRole = "Super Admin" | "Admin" | "Customer";

export type UserStatus = "Active" | "Inactive";

export enum ProductCategory {
  Fruit = "Fruit",
  Vegetable = "Vegetable",
  Meat = "Meat",
  Fish = "Fish",
  Other = "Other",
}

export enum ProductUnit {
  Kilo = "Per Kilo",
  Piece = "Per Piece",
}

export interface AuthTokenPayload {
  adminId?: number;
  customerId?: number;
}

export enum OrderStatus {
  Pending = "Pending",
  Approved = "Approved",
  Declined = "Declined",
  Cancelled = "Cancelled",
  Delivered = "Delivered",
}

export enum Gender {
  Male = "Male",
  Female = "Female",
  Other = "Other",
}
