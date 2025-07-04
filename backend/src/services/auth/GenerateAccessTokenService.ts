import jwt from 'jsonwebtoken';
import { StringValue } from 'ms';
import UserType from '../../types/UserType';

class GenerateAccessTokenService {
  public handle(userId: UserType['id']): string {
    const jwtSecret = process.env['JWT_SECRET'] || '';
    const expiresIn = (process.env['JWT_EXPIRATION'] || '') as StringValue;

    return jwt.sign({ userId }, jwtSecret, { expiresIn });
  }
}

export default GenerateAccessTokenService;
