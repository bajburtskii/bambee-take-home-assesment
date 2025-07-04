import { validationResult } from 'express-validator';
import { NextFunction, Request, Response } from 'express';

const checkExpressValidationMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

export default checkExpressValidationMiddleware;
