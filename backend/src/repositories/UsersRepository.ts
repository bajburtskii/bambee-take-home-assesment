import DbException from '../exceptions/DbException';
import { getDb } from '../db';
import { Database } from 'sqlite';
import UserType from '../types/UserType';

class UsersRepository {
  get db(): Database {
    return getDb();
  }

  public async getOneByEmail(email: UserType['email']): Promise<UserType | null> {
    try {
      const user = await this.db.get('SELECT * FROM users WHERE email = ?', [email]);

      if (!user) {
        return null;
      }

      return user;
    } catch (e: unknown) {
      throw new DbException(e);
    }
  }
}

export default UsersRepository;
