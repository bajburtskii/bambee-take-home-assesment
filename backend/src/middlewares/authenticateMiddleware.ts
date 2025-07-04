import { NextFunction, Request, Response } from 'express';
import JwtPayloadType from '../types/JwtPayloadType';
import VerifyTokenService from '../services/auth/VerifyTokenService';

const authenticateMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: 'Access token required' });
  }

  const token = authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  try {
    const decoded = new VerifyTokenService().handle(token);

    const jwtIsValid =
      typeof decoded === 'object' && decoded !== null && 'userId' in decoded && typeof decoded.userId === 'number';

    if (jwtIsValid) {
      req.user = decoded as JwtPayloadType;
    }

    next();
  } catch (e) {
    console.error(e);
    return res.status(401).json({ message: 'Invalid access token' });
  }
};

export default authenticateMiddleware;
