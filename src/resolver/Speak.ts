import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from 'type-graphql';
import { Speak, TargetType } from "../entity/Speak";
import {User} from "../entity/User";
import { dataSource } from "../data-source";

@Resolver(Speak)
export class SpeakResolver {
  private speakRepo = dataSource.getRepository(Speak);

  @Query(() => Speak)
  public async getSpeak(@Arg('id') id: number): Promise<Speak | null> {
    return await this.speakRepo.findOne({ where: { id } });
  }

  // getSpeaksByAuthor
  @Query(() => [Speak])
  public async getSpeaksByAuthor(@Arg('user') user: User): Promise<Speak[] | null> {
    return await this.speakRepo.find({ where: { owner_id: user.id } });
  }

  // getSpeaksByPublic
  @Query(() => [Speak])
  public async getSpeaksByTarget(@Arg('target', () => String) target: TargetType): Promise<Speak[] | void> {
    return await this.speakRepo.find({
      where: { target: target },
      relations: { owner: true, comments: true, likes: true},
      order: { created_at: "DESC" }
    });
  }

  @Mutation(() => Speak)
  @Authorized()
  public async createSpeak(
    @Arg('values', () => Speak) values: Speak,
    @Ctx() ctx
  ): Promise<Speak | void> {
    const speak = this.speakRepo.create({ ...values, owner_id: ctx.user.id });

    return await this.speakRepo
      .save(speak)
      .catch((e) => console.log('speak save error', e));
  }

  @Mutation(() => Speak)
  public async updateSpeak(
    @Arg('id') id: number,
    @Arg('values') values: Speak
  ): Promise<Speak> {
    const speak = await this.speakRepo.findOne({
      where: { id },
    });

    if (!speak) {
      throw new Error(
        "Speak not found or you're not authorize to update this one !"
      );
    }
    const updatedSpeak= Object.assign(speak, values);
    return await this.speakRepo.save(updatedSpeak);
  }

  @Mutation(() => Boolean)
  public async deleteSpeak(@Arg('id') id: number): Promise<boolean> {
    const speak = await this.speakRepo.findOne({ where: { id } });

    if (!speak) {
      throw new Error('Speak not found !');
    }

    try {
      await this.speakRepo.remove(speak);
      return true;
    } catch (err) {
      throw new Error('you are not allowed to delete this speak');
    }
  }

  @Mutation(() => Speak)
  @Authorized()
  public async toggleSpeakLike(
    @Arg('speak') speak: number,
    @Ctx() ctx
  ): Promise<Speak|undefined> {

    const spk = await this.speakRepo.findOne({
      where: { id: speak },
      relations: {owner: true, likes: true}
    });

    if (!spk) {
      throw new Error(
        "Speak not found or you're not authorize to update this one !"
      );
    }

    let updatedSpeak;
    if (spk.likes && spk.likes.length > 0) {
      // if not liked yet
      updatedSpeak = Object.assign(speak, {...spk, likes: [...spk.likes, ctx.user]});
      // else
      const filtered =  spk.likes.filter((l) => l.id !== ctx.user.id)
      updatedSpeak = Object.assign(speak, {...spk, likes: filtered});
    } else {
      updatedSpeak = Object.assign(speak, {...spk, likes: [ctx.user]});
    }

    return await this.speakRepo.save(updatedSpeak);
  }

}
