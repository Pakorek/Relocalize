import { AuthChecker, ResolverData } from 'type-graphql';
import { dataType, decodeJwt } from './helpers';
import { User } from '../entity/User';
import { dataSource } from '../data-source';

export const passwordAuthChecker: AuthChecker = async (
  { root, args, context, info }: ResolverData<any>,
  roles
) => {
  // `roles` comes from the `@Authorized` decorator, eg. ["ADMIN", "MODERATOR"]
  try {
    const token = context.token;

    if (token) {
      const repo = dataSource.getRepository(User);
      // what happen if string ?
      const data: dataType | string = decodeJwt(token);
      // TODO : need to manage string case
      const userID: number = typeof data === 'string' ? +data : data.userId;

      const user: User = await repo.findOneOrFail({
        where: { id: +userID },
        relations: { places: { category: true, tags: true } },
      });
      // const { id, email, roles } = connectedUser;
      context.user = user;

      if (roles.length === 0) {
        return user !== undefined;
      }
      return JSON.parse(user.roles).some((role) => roles.includes(role));
    }
    return false;
  } catch (e) {
    console.log('auth checker error', e);
    return false;
  }
};
