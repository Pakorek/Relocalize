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
  @Authorized()
  public async createOwnerShop(
    @Arg('values', () => Shop) values: Shop,
    @Ctx() ctx
  ): Promise<Shop | void> {
    console.log('ctx.user', ctx)
    const shop = this.shopRepo.create({ ...values, owner: ctx.user.id });

    return await this.shopRepo
      .save(shop)
      .catch((err) => console.log('save shop error', err));
  }

  @Mutation(() => Shop)
  @Authorized()
  public async createContributionShop(
    @Arg('values', () => Shop) values: Shop,
    @Ctx() ctx
  ): Promise<Shop | void> {
    const shop = this.shopRepo.create({ ...values, contributor: ctx.user.id });

    // const shop = await this.shopRepo.save(newShop);
    // // now we can assign shop.id to other elements
    // shop.schedules?.map(async (s: any) => {
    //
    // })
    // console.log('resolver shop', shop)

    return await this.shopRepo
      .save(shop)
      .catch((err) => console.log('save shop error', err));
  }

  @Query(() => [Shop])
  public async getShops(
    @Arg('country') country: string,
  ): Promise<Shop[] | void> {
    const shops = await this.shopRepo.find({ country: country});

    if (!shops) {
      throw new Error('Any shops founded, sorry !');
    }
    return shops;
  }


  @Mutation(() => Shop)
  @Authorized()
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
