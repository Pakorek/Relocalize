import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from 'type-graphql';
import { getRepository } from 'typeorm';
import { Place } from '../entity/Place';

@Resolver(Place)
export class PlaceResolver {
  private placeRepo = getRepository(Place);

  @Mutation(() => Place)
  @Authorized()
  public async createPlace(
    @Arg('values', () => Place) values: Place,
    @Ctx() ctx
  ): Promise<Place | void> {
    console.log('ctx.user', ctx);
    const place = this.placeRepo.create({ ...values, owner: ctx.user.id });

    return await this.placeRepo
      .save(place)
      .catch((err) => console.log('save place error', err));
  }

  @Query(() => [Place])
  public async getPlaces(
    @Arg('country') country: string
  ): Promise<Place[] | void> {
    const places = await this.placeRepo.find({ country: country });

    if (!places) {
      throw new Error('Any places founded, sorry !');
    }
    return places;
  }

  @Mutation(() => Place)
  @Authorized()
  public async updatePlace(
    @Arg('id') id: number,
    @Arg('values') values: Place
    // @Ctx() ctx
  ): Promise<Place> {
    const place: Place | undefined = await this.placeRepo.findOne({
      where: { id: id },
    });

    if (!place) {
      throw new Error(
        "Place not found or you're not authorize to update them !"
      );
    }
    const updatedPlace: Place = Object.assign(place, values);

    return await this.placeRepo.save(updatedPlace);
  }

  @Mutation(() => Boolean)
  public async deletePlace(@Arg('id') id: number): Promise<boolean> {
    const place = await this.placeRepo.findOne({ where: { id } });

    if (!place) {
      throw new Error('place not found !');
    }

    try {
      await this.placeRepo.remove(place);
      return true;
    } catch (err) {
      throw new Error('you are not allowed to delete this place');
    }
  }
}
