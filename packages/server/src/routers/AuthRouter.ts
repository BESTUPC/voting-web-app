import { NextFunction, Request, Response, Router } from 'express';
import { AuthController } from '../controllers/AuthController';
import { AccessTokenInterface, CookieHandler } from '../utils/CookieHandler';

export class AuthRouter {
    /**
     * Express router instance.
     */
    private _router = Router();

    /**
     * Controller to use in this router.
     */
    private _controller = AuthController;

    /**
     * Get function for the express router.
     */
    get router(): Router {
        return this._router;
    }

    /**
     * Configures the router.
     */
    constructor() {
        this._configure();
    }

    /**
     * Connect routes to their matching controller endpoints.
     */
    private _configure() {
        this._router.get('/ping', async (req: Request, res: Response, next: NextFunction) => {
            try {
                if (!res.locals['user']) {
                    res.sendStatus(401);
                    return next();
                } else {
                    console.log(res.locals['user']);
                    res.sendStatus(200);
                    return next();
                }
            } catch (error) {
                return next(error);
            }
        });
        this._router.post('/login', async (req: Request, res: Response, next: NextFunction) => {
            try {
                if (!!res.locals['user']) {
                    const accessToken: AccessTokenInterface = {
                        userId: res.locals['user'].userId,
                    };
                    CookieHandler.set(res, accessToken);
                    res.sendStatus(200);
                    return next();
                } else {
                    const userId = await this._controller.signIn(req.body);
                    const accessToken: AccessTokenInterface = {
                        userId: userId,
                    };
                    CookieHandler.set(res, accessToken);
                    res.sendStatus(200);
                    return next();
                }
            } catch (error) {
                return next(error);
            }
        });
        this._router.post('/logout', async (_req: Request, res: Response, next: NextFunction) => {
            try {
                CookieHandler.removeFrom(res);
                res.status(200);
                return next();
            } catch (error) {
                return next(error);
            }
        });
    }
}
