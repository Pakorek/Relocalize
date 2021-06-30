import { Arg, Mutation, Resolver } from 'type-graphql';
import { getRepository } from 'typeorm';
import { Prospect } from '../entity/Prospect';

@Resolver(Prospect)
export class ProspectResolver {
  private prospectRepo = getRepository(Prospect);

  @Mutation(() => Prospect)
  public async createProspect(
    @Arg('values', () => Prospect) values: Prospect
  ): Promise<Prospect | void> {
    const prospect = this.prospectRepo.create({ ...values });

    return await this.prospectRepo
      .save(prospect)
      .catch((err) => console.log('save error', err));
  }

  @Mutation(() => Prospect)
  public async updateProspect(
    @Arg('id') id: number,
    @Arg('values') values: Prospect
    // @Ctx() ctx
  ): Promise<Prospect> {
    const prospect: Prospect | undefined = await this.prospectRepo.findOne({
      where: { id: id },
    });

    console.log('updateProspect', prospect);

    if (!prospect) {
      throw new Error(
        "Prospect not found or you're not authorize to update them !"
      );
    }
    const updatedProspect: Prospect = Object.assign(prospect, values);

    return await this.prospectRepo.save(updatedProspect);
  }

  @Mutation(() => Boolean)
  public async deleteProspect(@Arg('id') id: number): Promise<boolean> {
    const prospect = await this.prospectRepo.findOne({ where: { id } });

    if (!prospect) {
      throw new Error('Prospect not found !');
    }

    try {
      await this.prospectRepo.remove(prospect);
      return true;
    } catch (err) {
      throw new Error('you are not allowed to delete this prospect');
    }
  }
}
