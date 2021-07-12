import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from 'type-graphql';
import { User } from '../entity/User';
import * as bcrypt from 'bcrypt';
import { generateJwt } from '../utils/helpers';
import { getRepository } from 'typeorm';
import { Upload } from '../entity/Upload';

@Resolver(Upload)
export class ImageResolver {
  private imageRepo = getRepository(Upload);

  // @Mutation(() => Upload)
  // public async uploadFile(@Arg('file') file: File): Promise<Upload> {
  //
  // }

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
