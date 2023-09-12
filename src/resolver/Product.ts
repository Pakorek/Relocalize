import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from 'type-graphql';
import { dataSource } from '../data-source';
import { Product } from '../entity/Product';

@Resolver(Product)
export class ProductResolver {
  private productRepo = dataSource.getRepository(Product);

  @Mutation(() => Product)
  @Authorized()
  public async createProduct(
    @Arg('values', () => Product) values: Product,
    @Ctx() ctx
  ): Promise<Product | void> {
    const product = this.productRepo.create({ ...values });

    return await this.productRepo
      .save(product)
      .catch((err) => console.log('save product error', err));
  }

  @Query(() => [Product])
  public async getProductsByPlace(
    @Arg('place_id') place_id: number
  ): Promise<Product[] | void> {
    const products = await this.productRepo.find({
      relations: { place: true, category: true, tags: true },
      where: { place: place_id },
    });

    if (!products) {
      throw new Error('Any product founded, sorry !');
    }
    return products;
  }

  @Query(() => Product)
  public async getProductById(@Arg('id') id: number): Promise<Product> {
    const product: Product | null = await this.productRepo.findOne({
      where: { id: id },
      relations: { place: true, category: true, tags: true },
    });

    if (!product) {
      throw new Error(
        "product not found or you're not authorize to update them !"
      );
    }
    return product;
  }

  @Mutation(() => Product)
  @Authorized()
  public async updateProduct(
    @Arg('id') id: number,
    @Arg('values') values: Product
    // @Ctx() ctx
  ): Promise<Product | void> {
    const product: Product | null = await this.productRepo.findOne({
      where: { id: id },
    });

    if (!product) {
      throw new Error(
        "product not found or you're not authorize to update them !"
      );
    }
    const updatedProduct: Product = Object.assign(product, values);
    return await this.productRepo
      .save(updatedProduct)
      .catch((err) => console.log('update product error', err));
  }

  @Mutation(() => Boolean)
  public async deleteProduct(@Arg('id') id: number): Promise<boolean> {
    const product = await this.productRepo.findOne({ where: { id } });

    if (!product) {
      throw new Error('product not found !');
    }

    try {
      await this.productRepo.remove(product);
      return true;
    } catch (err) {
      throw new Error('you are not allowed to delete this product');
    }
  }
}
