import { NextFunction, Request, Response, Router } from 'express';
import { IUser } from 'interfaces';
import { UserController } from '../controllers/UserController';
import { validateUser } from '../utils/AuthMiddleware';
import { AccessTokenInterface, CookieHandler } from '../utils/CookieHandler';
import { OAuth2Client } from 'google-auth-library';

export class AuthRouter {
    /**
     * Express router instance.
     */
    private _router = Router();

    /**
     * Controller to use in this router.
     */
    private _controller = UserController;

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
        this._router.post('/login', async (req: Request, res: Response, next: NextFunction) => {
            try {
                validateUser(req, res, next);
                const accessToken: AccessTokenInterface = {
                    userId: res.locals['user'].userId,
                };
                CookieHandler.set(res, accessToken);
                res.sendStatus(200);
            } catch (error) {
                const client = new OAuth2Client(process.env.CLIENT_ID);
                const ticket = await client.verifyIdToken({
                    idToken: token,
                    audience: process.env.CLIENT_ID,
                });
                const { name, email, picture } = ticket.getPayload();
                const user = await db.user.upsert({
                    where: { email: email },
                    update: { name, picture },
                    create: { name, email, picture },
                });
                this._controller.addUser();
                const accessToken: AccessTokenInterface = {
                    userId: res.locals['user'].userId,
                };
                CookieHandler.set(res, accessToken);
            }
        });
        this._router.post('/logout', async (req: Request, res: Response, next: NextFunction) => {
            try {
                CookieHandler.removeFrom(res);
                res.status(200);
            } catch (error) {
                next(error);
            }
        });
    }
}
