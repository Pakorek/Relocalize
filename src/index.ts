import 'reflect-metadata';
import { buildSchema } from 'type-graphql';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import Express from 'express';
import cors = require('cors');
import cookieParser = require('cookie-parser');
import pkg from 'body-parser';
const { json } = pkg;
import http from 'http';
import { UserResolver } from './resolver/User';
import { passwordAuthChecker } from './utils/auth-checker';
import { PlaceResolver } from './resolver/Place';
import { FileUploadResolver } from './resolver/FileUpload';
import { CategoryResolver } from './resolver/Category';
import { TagResolver } from './resolver/Tag';
import { ProductResolver } from './resolver/Product';
import { AppDataSource } from './AppDataSource';
import { ImageResolver } from "./resolver/Image";

interface MyContext {
  token?: string;
  dataSources: {
    appDB: AppDataSource;
  };
}
const startServer = async () => {
  const schema = await buildSchema({
    resolvers: [
      UserResolver,
      PlaceResolver,
      ProductResolver,
      ImageResolver,
      CategoryResolver,
      TagResolver,
    ],
    authChecker: passwordAuthChecker,
    nullableByDefault: true,
  });

  const app = Express();
  const httpServer = http.createServer(app);
  app.use(cors());
  app.use(cookieParser());
  const server = new ApolloServer({
    schema,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });
  await server.start();
  app.use(
    '/graphql',
    cors<cors.CorsRequest>(),
    json(),
    expressMiddleware(server, {
      context: async ({ req }) => {
        const { cache } = server;
        const token = req.headers.authorization?.split('Bearer ')[1];
        return {
          dataSources: {
            appDB: new AppDataSource({ cache, token }),
          },
          token,
        };
      },
    })
  );
  await new Promise<void>((resolve) =>
    httpServer.listen({ port: 4300 }, resolve)
  );
};
startServer().catch((e) => {
  console.log(e);
});
