require("dotenv").config();
import "reflect-metadata";
import { ApolloServer } from "apollo-server-express";
import { ApolloServerPluginDrainHttpServer } from "apollo-server-core";
import { buildSchema, registerEnumType } from "type-graphql";
import { createConnection, getConnectionOptions } from "typeorm";
import express from "express";
import http from "http";
import { __prod__ } from "./constants";
import { Gender, OrderStatus, ProductCategory, ProductUnit } from "./types";

async function startApolloServer() {
  const connectionOptions = await getConnectionOptions();

  Object.assign(connectionOptions, { synchronize: true });

  await createConnection(connectionOptions);

  const app = express();

  const httpServer = http.createServer(app);

  registerEnumType(Gender, {
    name: "Gender", // this one is mandatory
  });

  registerEnumType(OrderStatus, {
    name: "OrderStatus", // this one is mandatory
  });

  registerEnumType(ProductCategory, {
    name: "ProductCategory", // this one is mandatory
  });

  registerEnumType(ProductUnit, {
    name: "ProductUnit", // this one is mandatory
  });

  const server = new ApolloServer({
    schema: await buildSchema({
      resolvers: [__dirname + "/resolvers/**/*.{ts,js}"],
      dateScalarMode: "timestamp",
      validate: false,
    }),
    context: ({ req, res }) => ({
      req,
      res,
    }),
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });
  await server.start();
  server.applyMiddleware({
    app,
  });
  await new Promise<void>((resolve) =>
    httpServer.listen({ port: process.env.PORT }, resolve)
  );
  console.log(
    `🚀 Server ready at ${process.env.HOST}:${process.env.PORT}${server.graphqlPath}`
  );
}

startApolloServer().catch((err) => {
  console.log(err);
});
