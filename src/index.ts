import 'reflect-metadata';
import { buildSchema } from 'type-graphql';
import { ApolloServer } from 'apollo-server-express';
import Express from 'express';
import cors = require('cors');
import cookieParser = require('cookie-parser');
import { UserResolver } from './resolver/User';
import { passwordAuthChecker } from './utils/auth-checker';
import { PlaceResolver } from './resolver/Place';
import { FileUploadResolver } from './resolver/FileUpload';
import { CategoryResolver } from './resolver/Category';
import { TagResolver } from './resolver/Tag';
import { ProductResolver } from './resolver/Product';

const startServer = async () => {
  const schema = await buildSchema({
    resolvers: [
      UserResolver,
      PlaceResolver,
      ProductResolver,
      FileUploadResolver,
      CategoryResolver,
      TagResolver,
    ],
    authChecker: passwordAuthChecker,
    nullableByDefault: true,
  });

  const app = Express();
  app.use(cors());
  app.use(cookieParser());
  const server = new ApolloServer({
    schema,
    uploads: false,
    context: ({ req, res }) => ({ req, res }),
  });
  // app.use(graphqlUploadExpress({ maxFileSize: 10000000, maxFiles: 10 }));
  server.applyMiddleware({ app });

  app.listen(4300, () => {
    console.log('server started');
  });
};
startServer().catch((e) => {
  console.log(e);
});
