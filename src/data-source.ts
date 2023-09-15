import { DataSource } from 'typeorm';
import { User } from './entity/User';
import { Place } from './entity/Place';
import { Product } from './entity/Product';
import { Category } from './entity/Category';
import { AuthResult } from './entity/AuthResult';
import { Image } from "./entity/Image";
import { Tag } from './entity/Tag';
import { Bookmark } from './entity/Bookmark';

import dotenv from 'dotenv';
dotenv.config();

export const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: 5432,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: 'agora',
  entities: [User, Place, Product, Category, Tag, AuthResult, Image, Bookmark],
  synchronize: false,
  migrations: ['migration/*.ts'],
});

dataSource
  .initialize()
  .then(() => {
    console.log('Data Source has been initialized!');
  })
  .catch((err) => {
    console.error('Error during Data Source initialization', err);
  });
