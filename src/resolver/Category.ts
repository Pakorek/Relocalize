import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from 'type-graphql';
import { dataSource } from '../data-source';
import { Category } from '../entity/Category';

@Resolver(Category)
export class CategoryResolver {
  private categoryRepo = dataSource.getRepository(Category);

  @Mutation(() => Category)
  // @Authorized()
  public async createCategory(
    @Arg('values', () => Category) values: Category,
    @Ctx() ctx
  ): Promise<Category | void> {
    // const place = this.categoryRepo.create({ ...values, owner: ctx.user.id });
    const category = this.categoryRepo.create({ ...values });

    return await this.categoryRepo
      .save(category)
      .catch((err) => console.log('save category error', err));
  }

  @Query(() => [Category])
  public async getCategories(): Promise<Category[] | void> {
    // const places = await this.categoryRepo.find({ relations: { owner: true } });
    const categories = await this.categoryRepo.find({
      relations: { parent: true },
    });

    if (!categories) {
      throw new Error('Any categories founded, sorry !');
    }
    return categories;
  }

  @Mutation(() => Category)
  @Authorized()
  public async updateCategory(
    @Arg('id') id: number,
    @Arg('values') values: Category
    // @Ctx() ctx
  ): Promise<Category> {
    const category: Category | null = await this.categoryRepo.findOne({
      where: { id: id },
    });

    if (!category) {
      throw new Error(
        "Category not found or you're not authorize to update them !"
      );
    }
    const updatedCategory: Category = Object.assign(category, values);

    return await this.categoryRepo.save(updatedCategory);
  }

  @Mutation(() => Boolean)
  public async deleteCategory(@Arg('id') id: number): Promise<boolean> {
    const category = await this.categoryRepo.findOne({ where: { id } });

    if (!category) {
      throw new Error('category not found !');
    }

    try {
      await this.categoryRepo.remove(category);
      return true;
    } catch (err) {
      throw new Error('you are not allowed to delete this category');
    }
  }
}
