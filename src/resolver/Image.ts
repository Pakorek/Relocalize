import { Arg, Mutation, Resolver } from "type-graphql";
import { Image } from "../entity/Image";
import { dataSource } from "../data-source";
import { EntityTarget } from "../entity/type/Image";

@Resolver(Image)
export class ImageResolver {
  private imageRepo = dataSource.getRepository(Image);

  @Mutation(() => Image)
  public async addImage(@Arg('image', () => Image) image: Image): Promise<Image | void> {
    let entity: Image | undefined = undefined;
    switch (image.target) {
      case EntityTarget.PLACE:
        entity = this.imageRepo.create({ url: image.url, place_id: image.target_id });
        break;
      case EntityTarget.PRODUCT:
        entity = this.imageRepo.create({ url: image.url, product_id: image.target_id });
        break;
    }
    if (entity) {
      return await this.imageRepo
        .save(entity)
        .catch((err) => console.log('save image error', err));
    }
  }

  @Mutation(() => Boolean)
  public async deleteImage(@Arg('id') id: number): Promise<boolean> {
    const image = await this.imageRepo.findOne({ where: { id } });

    if (!image) {
      throw new Error('Upload not found !');
    }

    try {
      await this.imageRepo.remove(image);
      return true;
    } catch (err) {
      throw new Error('you are not allowed to delete this image');
    }
  }
}
