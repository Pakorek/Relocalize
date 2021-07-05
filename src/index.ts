import 'reflect-metadata';
import { createConnection } from 'typeorm';
import { buildSchema } from 'type-graphql';
import { ApolloServer } from 'apollo-server-express';
import Express from 'express';
import cors = require('cors');
import cookieParser = require('cookie-parser');
import dotenv from 'dotenv';
import { UserResolver } from './resolver/User';
import { passwordAuthChecker } from './utils/auth-checker';
import { User } from './entity/User';
import { Shop } from './entity/Shop';
import { Product } from './entity/Product';
import { Service } from './entity/Service';
import { ContactInformation } from './entity/ContactInformation';
import { Category } from './entity/Category';
import { Schedules } from './entity/Schedules';
import { AuthResult } from './entity/AuthResult';
import { ShopResolver } from './resolver/Shop';

dotenv.config();

const startServer = async () => {
  await createConnection({
    type: 'mysql',
    host: process.env.DB_HOST,
    port: 3306,
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: 'relocalize',
    entities: [User, Shop, Product, Service, ContactInformation, Category, Schedules, AuthResult],
    synchronize: true,
    migrations: ['migration/*.ts'],
    cli: {
      migrationsDir: 'migration',
    },
  });

  const schema = await buildSchema({
    resolvers: [UserResolver, ShopResolver],
    authChecker: passwordAuthChecker,
    nullableByDefault: true,
  });

  const app = Express();
  app.use(cors());
  app.use(cookieParser());
  const server = new ApolloServer({
    schema,
    context: ({ req, res }) => ({ req, res }),
  });

  server.applyMiddleware({ app });

  app.listen(4300, () => {
    console.log('server started');
  });
};
startServer().catch((e) => {
  console.log(e);
});
