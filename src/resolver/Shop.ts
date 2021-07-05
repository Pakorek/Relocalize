import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from 'type-graphql';
import * as bcrypt from 'bcrypt';
import { getRepository } from 'typeorm';
import { Shop } from '../entity/Shop';
import { User } from '../entity/User';
import { generateJwt } from '../utils/helpers';
import { AuthResult } from '../entity/AuthResult';

@Resolver(Shop)
export class ShopResolver {
  private shopRepo = getRepository(Shop);


  @Mutation(() => Shop)
  public async createShop(
    @Arg('values', () => Shop) values: Shop
  ): Promise<Shop | void> {
    // get userId
    const shop = this.shopRepo.create({ ...values });

    return await this.shopRepo
      .save(shop)
      .catch((err) => console.log('save shop error', err));
  }

  @Mutation(() => Shop)
  public async updateShop(
    @Arg('id') id: number,
    @Arg('values') values: Shop
    // @Ctx() ctx
  ): Promise<Shop> {
    const shop: Shop | undefined = await this.shopRepo.findOne({
      where: { id: id },
    });

    console.log('updateUser', shop);

    if (!shop) {
      throw new Error(
        "Shop not found or you're not authorize to update them !"
      );
    }
    const updatedShop: Shop = Object.assign(shop, values);

    return await this.shopRepo.save(updatedShop);
  }

  @Mutation(() => Boolean)
  public async deleteShop(@Arg('id') id: number): Promise<boolean> {
    const shop = await this.shopRepo.findOne({ where: { id } });

    if (!shop) {
      throw new Error('User not found !');
    }

    try {
      await this.shopRepo.remove(shop);
      return true;
    } catch (err) {
      throw new Error('you are not allowed to delete this shop');
    }
  }
}
