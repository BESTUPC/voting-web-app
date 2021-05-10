import { NextFunction, Request, Response, Router } from 'express';
import { UserController } from '../controllers/UserController';
import { IUser } from 'interfaces';

export class UserRouter {
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
        this._router.get('/', async (req: Request, res: Response, next: NextFunction) => {
            try {
                const user: IUser = res.locals['user'];
                const result: Array<IUser> = await this._controller.getUsers(user.userId);
                res.status(200).json(result);
            } catch (error) {
                next(error);
            }
        });
        this._router.patch(
            '/membership/:id',
            async (req: Request, res: Response, next: NextFunction) => {
                try {
                    const user: IUser = res.locals['user'];
                    const result = await this._controller.updateMembership(
                        user.userId,
                        req.params.id,
                        req.body,
                    );
                    res.status(200).json(result);
                } catch (error) {
                    next(error);
                }
            },
        );
        this._router.get('/current', async (req: Request, res: Response, next: NextFunction) => {
            try {
                const user: IUser = res.locals['user'];
                const result: IUser = await this._controller.getUser(user.userId, user.userId);
                res.status(200).json(result);
            } catch (error) {
                next(error);
            }
        });
        this._router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
            try {
                const user: IUser = res.locals['user'];
                const result = await this._controller.getUser(user.userId, req.params.id);
                res.status(200).json(result);
            } catch (error) {
                next(error);
            }
        });
    }
}
