import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from 'type-graphql';
import { dataSource } from '../data-source';
import { TradeBack } from "../entity/TradeBack";

@Resolver(TradeBack)
export class TradeBackResolver {
  private tradeRepo = dataSource.getRepository(TradeBack);

  @Mutation(() => TradeBack)
  // @Authorized()
  public async createTradeBack(
    @Arg('values', () => TradeBack) values: TradeBack
  ): Promise<TradeBack | void> {
    const trade: TradeBack = this.tradeRepo.create({ ...values });

    return await this.tradeRepo
      .save(trade)
      .catch((err) => console.log('save trade error', err));
  }

  @Query(() => [TradeBack])
  public async getTradeBacksByTrade(
    @Arg('id') id: number
  ): Promise<TradeBack[] | void> {
    const trades: TradeBack[] = await this.tradeRepo.find({
      where: {trade_id: id}
    });

    if (!trades) {
      throw new Error('Any trade founded, sorry !');
    }
    return trades;
  }

  @Mutation(() => TradeBack)
  @Authorized()
  public async updateTradeBack(
    @Arg('id') id: number,
    @Arg('values') values: TradeBack
    // @Ctx() ctx
  ): Promise<TradeBack> {
    const trade: TradeBack | null = await this.tradeRepo.findOne({
      where: { id: id },
    });

    if (!trade) {
      throw new Error("trade not found or you're not authorize to update them !");
    }
    const updatedTradeBack: TradeBack = Object.assign(trade, values);

    return await this.tradeRepo.save(updatedTradeBack);
  }

  @Mutation(() => Boolean)
  public async deleteTradeBack(@Arg('id') id: number): Promise<boolean> {
    const trade: TradeBack | null = await this.tradeRepo.findOne({ where: { id } });

    if (!trade) {
      throw new Error('TradeBack not found !');
    }

    try {
      await this.tradeRepo.remove(trade);
      return true;
    } catch (err) {
      throw new Error('you are not allowed to delete this trade');
    }
  }
}
