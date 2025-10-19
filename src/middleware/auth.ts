import { Request, Response, NextFunction } from 'express';
import { unauthorizedError } from '@/utils/errors/common.js';
import jwt from 'jsonwebtoken';

/**
 * Authentication middleware to validate JWT token
 * @param req Express Request
 * @param res Express Response
 * @param next Express NextFunction
 */
export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(' ')[1]; // Bearer <token>

    if (token) {
      try {
        // In a real application, you would verify the JWT token here
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default-secret');
        (req as any).user = decoded;
        next();
      } catch (error) {
        next(unauthorizedError());
      }
    } else {
      next(unauthorizedError());
    }
  } else {
    next(unauthorizedError());
  }
};


