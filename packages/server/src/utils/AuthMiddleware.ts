import { NextFunction, Request, Response } from 'express';
import { UserModel } from '../models/UserModel';
import { CookieHandler } from './CookieHandler';
import { ErrorHandler } from './ErrorHandler';
export const validateUser = (failOnNotFound = true) => async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const accesToken = CookieHandler.getFrom(req);
        if (!accesToken) {
            throw new ErrorHandler(401, 'No cookie in request');
        }
        const user = await UserModel.get(accesToken.userId);
        if (!user) {
            throw new ErrorHandler(401, 'User does not exist');
        }
        res.locals['user'] = user;
        return next();
    } catch (e) {
        if (failOnNotFound) {
            throw new ErrorHandler(401, 'Error getting user from cookie');
        } else {
            return next();
        }
    }
};
