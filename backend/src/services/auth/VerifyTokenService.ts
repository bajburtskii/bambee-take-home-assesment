import jwt, { Jwt, JwtPayload } from 'jsonwebtoken';

class VerifyTokenService {
  public handle(token: string): Jwt | JwtPayload | string {
    const jwtSecret = process.env['JWT_SECRET'] || '';

    return jwt.verify(token, jwtSecret);
  }
}

export default VerifyTokenService;
