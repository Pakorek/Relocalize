import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from 'type-graphql';
import { Place } from '../entity/Place';
import { dataSource } from '../data-source';


@Resolver(Place)
export class PlaceResolver {
  private placeRepo = dataSource.getRepository(Place);

  @Mutation(() => Place)
  @Authorized()
  public async createPlace(
    @Arg('values', () => Place) values: Place,
    @Ctx() ctx
  ): Promise<Place | void> {
    // TODO : add created_at format 2023-07-15 16:29:51
    const place = this.placeRepo.create({ ...values, owner_id: ctx.user.id });

    return await this.placeRepo
      .save(place)
      .catch((err) => console.log('save place error', err));
  }

  @Query(() => [Place])
  public async getProPlaces(): Promise<Place[] | void> {
    const places = await this.placeRepo.find({
      relations: { owner: true, category: true, tags: true },
      where: { type: 'PROFESSIONAL' },
    });

    if (!places) {
      throw new Error('Any place founded, sorry !');
    }
    return places;
  }

  @Query(() => [Place])
  public async getAssoPlaces(): Promise<Place[] | void> {
    const places = await this.placeRepo.find({
      relations: { owner: true, category: true, tags: true },
      where: { type: 'ASSOCIATION' },
    });

    if (!places) {
      throw new Error('Any place founded, sorry !');
    }
    return places;
  }

  @Query(() => Place)
  public async getPlaceById(@Arg('id') id: number): Promise<Place> {
    const place: Place | null = await this.placeRepo.findOne({
      where: { id: id },
      relations: { owner: true, category: true, tags: true },
    });

    if (!place) {
      throw new Error(
        "Place not found or you're not authorize to update them !"
      );
    }
    return place;
  }

  @Mutation(() => Place)
  @Authorized()
  public async updatePlace(
    @Arg('id') id: number,
    @Arg('values') values: Place
    // @Ctx() ctx
  ): Promise<Place | void> {
    const place: Place | null = await this.placeRepo.findOne({
      where: { id: id },
    });

    if (!place) {
      throw new Error(
        "Place not found or you're not authorize to update them !"
      );
    }
    // TODO : add updated_at format 2023-07-15 16:29:51
    const updatedPlace: Place = Object.assign(place, values);

    return await this.placeRepo
      .save(updatedPlace)
      .catch((err) => console.log('update place error', err));
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
