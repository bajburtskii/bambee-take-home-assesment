import bcrypt from 'bcryptjs';
import UserType from '../../types/UserType';

class CheckIfPasswordIsValidService {
  public async handle(user: UserType, password: string): Promise<boolean> {
    return await bcrypt.compare(password, user.password);
  }
}

export default CheckIfPasswordIsValidService;
