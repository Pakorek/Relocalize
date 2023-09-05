import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from 'type-graphql';
import { dataSource } from '../data-source';
import { Tag } from '../entity/Tag';

@Resolver(Tag)
export class TagResolver {
  private tagRepo = dataSource.getRepository(Tag);

  @Mutation(() => Tag)
  // @Authorized()
  public async createTag(
    @Arg('values', () => Tag) values: Tag
  ): Promise<Tag | void> {
    const tag: Tag = this.tagRepo.create({ ...values });

    return await this.tagRepo
      .save(tag)
      .catch((err) => console.log('save tag error', err));
  }

  @Query(() => [Tag])
  public async getTags(): Promise<Tag[] | void> {
    const tags: Tag[] = await this.tagRepo.find();

    if (!tags) {
      throw new Error('Any tag founded, sorry !');
    }
    return tags;
  }

  @Mutation(() => Tag)
  @Authorized()
  public async updateTag(
    @Arg('id') id: number,
    @Arg('values') values: Tag
    // @Ctx() ctx
  ): Promise<Tag> {
    const tag: Tag | null = await this.tagRepo.findOne({
      where: { id: id },
    });

    if (!tag) {
      throw new Error("tag not found or you're not authorize to update them !");
    }
    const updatedTag: Tag = Object.assign(tag, values);

    return await this.tagRepo.save(updatedTag);
  }

  @Mutation(() => Boolean)
  public async deleteTag(@Arg('id') id: number): Promise<boolean> {
    const tag: Tag | null = await this.tagRepo.findOne({ where: { id } });

    if (!tag) {
      throw new Error('tag not found !');
    }

    try {
      await this.tagRepo.remove(tag);
      return true;
    } catch (err) {
      throw new Error('you are not allowed to delete this tag');
    }
  }
}
