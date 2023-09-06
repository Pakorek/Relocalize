import { AuthChecker } from 'type-graphql';
import { getManager } from 'typeorm';
import { dataType, decodeJwt } from './helpers';
import { User } from '../entity/User';
import { dataSource } from "../data-source";

export const passwordAuthChecker: AuthChecker = async (
  { context }: any,
  roles
) => {
  // `roles` comes from the `@Authorized` decorator, eg. ["ADMIN", "MODERATOR"]
  try {
    const token = context.req.headers.authorization.split('Bearer ')[1];

    if (token) {
      const repo = dataSource.getRepository(User);
      // what happen if string ?
      const data: dataType | string = decodeJwt(token);
      // 6 next lines aren't ok : need to manage string case
      let userID: number;
      if (typeof data === 'string') {
        userID = +data;
      } else {
        userID = data.userId;
      }
      const user: User = await repo.findOneOrFail({
        where: { id: +userID },
        relations: { places: { category: true } },
      });
      // const { id, email, roles } = connectedUser;
      context.user = user;

      if (roles.length === 0) {
        return user !== undefined;
      }
      return JSON.parse(user.roles).some((role) => roles.includes(role));
    }
    return false;
  } catch {
    return false;
  }
};
