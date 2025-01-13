import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import AppError from "../utils/appError";
import {catchAsync} from "../utils/catchAsync";
import {User} from "../models/user.model";

interface TokenPayload {
  _id: string;
  roles: string[];
  email: string;
}

const generateToken = (_id: string, roles: string[], email: string) => {
  const payload: TokenPayload = {_id, roles, email };
  const jwtSecret = process.env.JWT_SECRET || "";
  const token = jwt.sign(payload, jwtSecret, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  return token;
};

const authenticate = catchAsync(async(req: Request, res: Response, next: NextFunction) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      res.status(401);
      throw new AppError('You are not login, please log in', 401);
    }

    const jwtSecret = process.env.JWT_SECRET || "";
    const decoded = jwt.verify(token, jwtSecret) as JwtPayload;

    if (!decoded || !decoded._id) {
      throw new AppError("Not authorized, userId not found", 401);
    }

    const currentUser = await User.findById(decoded._id);

    if (!currentUser) {
      throw new AppError("Not authorized, doesnt exists", 401);
    }

    req.user = currentUser;

  next();
});

const authorizedUser = (allowedRoles: string[]) => {
  return catchAsync(async(req: Request, res: Response, next: NextFunction) => {
    const userRoles = req.user?.roles;

    if(!userRoles || !userRoles.some((roles:string) => allowedRoles.includes(roles))){
      throw new AppError("You lack the authorization for this action", 403);
    }
    next();
  });
};

export { generateToken, authenticate, authorizedUser};