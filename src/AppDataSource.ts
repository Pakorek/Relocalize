import { DataSource } from 'typeorm';
import { User } from './entity/User';
import { Place } from './entity/Place';
import { Product } from './entity/Product';
import { Category } from './entity/Category';
import { Tag } from './entity/Tag';
import { AuthResult } from './entity/AuthResult';
import { Upload } from './entity/Upload';
import { Bookmark } from './entity/Bookmark';
import { KeyValueCache } from '@apollo/utils.keyvaluecache';

export class AppDataSource {
  private dbConnection;
  private token;
  private userRepo;

  constructor(options: {
    cache: KeyValueCache;
    token: string | string[] | undefined;
  }) {
    this.dbConnection = this.initializeDBConnection();
    this.token = options.token;
  }

  async initializeDBConnection(): Promise<DataSource> {
    // set up our database details, instantiate our connection,
    // and return that database connection
    return new DataSource({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: 5432,
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: 'agora',
      entities: [
        User,
        Place,
        Product,
        Category,
        Tag,
        AuthResult,
        Upload,
        Bookmark,
      ],
      synchronize: false,
      migrations: ['migration/*.ts'],
    });
  }

  async getUserRepo() {
    if (!this.userRepo) {
      // store the user, lookup by token
      this.userRepo = await this.dbConnection.getRepository(User);
    }
    return this.userRepo;
  }
}
