import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { AuthResult } from "../entity/AuthResult";
import { User } from "../entity/User";
import * as bcrypt from "bcrypt";
import { generateJwt } from "../utils/helpers";
import { Bookmark } from "../entity/Bookmark";
import { dataSource } from "../data-source";
import { IsNull, Not, Repository } from "typeorm";
import { Place } from "../entity/Place";
import { Product } from "../entity/Product";

@Resolver(User)
export class UserResolver {
  private userRepo: Repository<User> = dataSource.getRepository(User);
  private bookmarkRepo: Repository<Bookmark> = dataSource.getRepository(Bookmark);

  static async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  }

  @Query(() => User)
  @Authorized()
  public async authenticatedUser(@Ctx() ctx): Promise<User> {
    return ctx.user;
  }

  @Query(() => User)
  @Authorized()
  public async getUser(@Ctx() ctx): Promise<User> {
    return ctx.user;
  }

  @Mutation(() => AuthResult, { nullable: true })
  public async authenticate(
    @Arg('email') email: string,
    @Arg('password') password: string
    // @Ctx() ctx
  ): Promise<AuthResult> {
    const user: User = await this.userRepo.findOneOrFail({
      where: { email },
    });

    if (user && (await bcrypt.compare(password, user.password)) === true) {
      const token = generateJwt({
        userId: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        // role: user.role,
      });

      return { token, user };
    } else {
      return {};
    }
  }

  @Mutation(() => User)
  public async createUser(
    @Arg('values', () => User) values: User
  ): Promise<User | void> {
    const hash: string = await UserResolver.hashPassword(values.password);
    const user: User = this.userRepo.create({ ...values, password: hash });

    // TODO : on dev, need use object with spread operator then stringify
    user.roles = JSON.stringify(['ROLE_USER']);

    return await this.userRepo
      .save(user)
      .catch((err) => console.log('save error', err));
  }

  @Mutation(() => User)
  public async updateUser(
    @Arg('id') id: number,
    @Arg('values') values: User
    // @Ctx() ctx
  ): Promise<User> {
    const user: User | null = await this.userRepo.findOne({
      where: { id: id },
    });

    if (!user) {
      throw new Error(
        "User not found or you're not authorize to update them !"
      );
    }
    const updatedUser: User = Object.assign(user, values);

    return await this.userRepo.save(updatedUser);
  }

  @Mutation(() => Boolean)
  public async deleteUser(@Arg('id') id: number): Promise<boolean> {
    const user: User | null = await this.userRepo.findOne({ where: { id } });

    if (!user) {
      throw new Error('User not found !');
    }

    try {
      await this.userRepo.remove(user);
      return true;
    } catch (err) {
      throw new Error('you are not allowed to delete this user');
    }
  }

  @Query(() => [User])
  public async getUsers(): Promise<User[]> {
    return await this.userRepo.find({
      order: {
        email: 'ASC',
      },
    });
  }

  @Mutation(() => Bookmark || Boolean)
  @Authorized()
  public async toggleBookmark(
    @Arg('values', () => Bookmark) values: Bookmark,
    @Ctx() ctx
  ): Promise<Bookmark | void | boolean> {
    const isBookmarkExist: Bookmark | null = await this.bookmarkRepo.findOne({
      where: {
        owner_id: ctx.user.id,
        place_id: values.place_id,
        product_id: values.product_id,
      },
    });

    if (isBookmarkExist) {
      try {
        await this.bookmarkRepo.remove(isBookmarkExist);
        return true;
      } catch (err) {
        throw new Error('you are not allowed to delete this bookmark');
      }
    }

    // TODO : add created_at format 2023-07-15 16:29:51
    const bookmark: Bookmark = this.bookmarkRepo.create({
      ...values,
      owner_id: ctx.user.id,
    });

    return await this.bookmarkRepo
      .save(bookmark)
      .catch((err) => console.log('save bookmark error', err));
  }

  @Query(() => Boolean)
  @Authorized()
  public async isBookmarked(
    @Arg('values', () => Bookmark) values: Bookmark,
    @Ctx() ctx
  ): Promise<boolean> {
    const bookmark: Bookmark | null = await this.bookmarkRepo.findOne({
      where: {
        owner_id: ctx.user.id,
        place_id: values.place_id,
        product_id: values.product_id,
      },
    });
    return bookmark !== null;
  }

  @Query(() => [Place])
  @Authorized()
  public async getBookmarkedPlaces(
    @Ctx() ctx
  ): Promise<(Place | undefined)[]> {
    const bookmarks: Bookmark[] = await this.bookmarkRepo.find({
      relations: {place: {images: true, category: true}},
      where: {
        owner_id: ctx.user.id,
        place_id: Not(IsNull())
      },
    });

    return bookmarks.map(b => b.place);
  }

  @Query(() => [Product])
  @Authorized()
  public async getBookmarkedProducts(
    @Ctx() ctx
  ): Promise<(Product | undefined)[]> {
    const bookmarks: Bookmark[] = await this.bookmarkRepo.find({
      relations: {product: {images: true, category: true}},
      where: {
        owner_id: ctx.user.id,
        product_id: Not(IsNull())
      },
    });

    return bookmarks.map(b => b.product);
  }
}
