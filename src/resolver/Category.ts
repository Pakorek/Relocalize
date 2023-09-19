import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from 'type-graphql';
import { dataSource } from '../data-source';
import { Category } from '../entity/Category';
import { IsNull, Not } from "typeorm";

type groupedCategories = {
  label: string;
  childs: Category[];
};

@Resolver(Category)
export class CategoryResolver {
  private categoryRepo = dataSource.getRepository(Category);

  @Mutation(() => Category)
  // @Authorized()
  public async createCategory(
    @Arg('values', () => Category) values: Category,
    @Ctx() ctx
  ): Promise<Category | void> {
    const category = this.categoryRepo.create({ ...values });

    return await this.categoryRepo
      .save(category)
      .catch((err) => console.log('save category error', err));
  }

  @Query(() => [Category])
  public async getProCategories(): Promise<groupedCategories[] | void> {
    const categories = await this.categoryRepo.find({
      relations: { parent: true },
      where: { place_type: 'PROFESSIONAL' },
      order: {
        parent: {
          label: 'ASC',
        },
        label: 'ASC',
      },
    });

    if (!categories) {
      throw new Error('Any category founded, sorry !');
    }

    const groupedData = {};
    categories.forEach((item: Category) => {
      const parent = item.parent;
      if (parent) {
        if (!groupedData[parent.label]) {
          groupedData[parent.label] = {
            label: parent.label,
            childs: [],
          };
        }
        groupedData[parent.label].childs.push({
          id: item.id,
          label: item.label,
        });
      }
    });

    return Object.values(groupedData);
  }

  @Query(() => [Category])
  public async getAssoCategories(): Promise<Category[] | void> {
    const categories = await this.categoryRepo.find({
      where: { place_type: 'ASSOCIATION' },
      order: {
        label: 'ASC',
      },
    });

    if (!categories) {
      throw new Error('Any category founded, sorry !');
    }

    return categories;
  }

  @Query(() => [Category])
  public async getProductCategories(): Promise<groupedCategories[] | void> {
    const categories = await this.categoryRepo.find({
      where: { product_type: Not(IsNull()) },
      order: {
        product_type: 'ASC',
        label: 'ASC'
      },
    });

    if (!categories) {
      throw new Error('Any category founded, sorry !');
    }
    const groupedData = {};
    categories.forEach((item: Category) => {
      const parent = item.product_type;
      if (parent) {
        if (!groupedData[parent]) {
          groupedData[parent] = {
            label: parent,
            childs: [],
          };
        }
        groupedData[parent].childs.push({
          id: item.id,
          label: item.label,
        });
      }
    });

    return Object.values(groupedData);


    // return categories;
  }

  @Mutation(() => Category)
  @Authorized()
  public async updateCategory(
    @Arg('id') id: number,
    @Arg('values') values: Category
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
