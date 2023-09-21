import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from 'type-graphql';
import {Speak} from "../entity/Speak";
import {Comment} from "../entity/Comment";
import { dataSource } from "../data-source";

@Resolver(Comment)
export class CommentResolver {
  private commentRepo = dataSource.getRepository(Comment);

  @Query(() => Comment)
  public async getComment(@Arg('id') id: number): Promise<Comment | null> {
    return await this.commentRepo.findOne({ where: { id } });
  }

  @Query(() => [Comment])
  public async getCommentsBySpeak(@Arg('speak') speak: Speak): Promise<Comment[]> {
    return await this.commentRepo.find({ where: { speak_id: speak.id } });
  }

  @Mutation(() => Comment)
  @Authorized()
  public async createComment(
    @Arg('values', () => Comment) values: Comment,
    @Ctx() ctx
  ): Promise<Comment | void> {
    const comment = this.commentRepo.create({ ...values, owner_id: ctx.user.id });

    return await this.commentRepo
      .save(comment)
      .catch((e) => console.log('speak save error', e));
  }

  @Mutation(() => Comment)
  public async updateComment(
    @Arg('id') id: number,
    @Arg('values') values: Comment
  ): Promise<Comment> {
    const comment = await this.commentRepo.findOne({
      where: { id },
    });

    if (!comment) {
      throw new Error(
        "Comment not found or you're not authorize to update this one !"
      );
    }
    const updatedComment= Object.assign(comment, values);
    return await this.commentRepo.save(updatedComment);
  }

  @Mutation(() => Boolean)
  public async deleteComment(@Arg('id') id: number): Promise<boolean> {
    const comment = await this.commentRepo.findOne({ where: { id } });

    if (!comment) {
      throw new Error('Comment not found !');
    }

    try {
      await this.commentRepo.remove(comment);
      return true;
    } catch (err) {
      throw new Error('you are not allowed to delete this comment');
    }
  }
}
