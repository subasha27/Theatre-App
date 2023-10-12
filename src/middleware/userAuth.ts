import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import dotenv from "dotenv";
dotenv.config()

declare namespace Express {
  export interface Request {
    user?: any; // Adjust the type to match your user data
  }
}

function authenticateUser(req: Request, res: Response, next: NextFunction) {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: 'Authorization token not found' });
  }

  try {
    const decoded = jwt.verify(token, process.env.userSecretKey as string);

    if (typeof decoded === 'object' && 'id' in decoded && 'email' in decoded) {
  
      const { id, email } = decoded;

      
      (req as any).userId = id;
      (req as any).userEmail = email;

      next();
    } else {
      return res.status(401).json({ message: 'Invalid token' });
    }
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
}

export default authenticateUser;   