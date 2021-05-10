import { NextFunction, Request, Response, Router } from 'express';
import { IDelegation, IUser } from 'interfaces';
import { DelegationController } from '../controllers/DelegationController';

export class DelegationRouter {
    /**
     * Express router instance.
     */
    private _router = Router();

    /**
     * Controller to use in this router.
     */
    private _controller = DelegationController;

    /**
     * Get function for the express router.
     */
    get router(): Router {
        return this._router;
    }

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
                const result: Array<IDelegation> = await this._controller.getDelegations(
                    user.userId,
                );
                res.status(200).json(result);
            } catch (error) {
                next(error);
            }
        });
        this._router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
            try {
                const user: IUser = res.locals['user'];
                const result: Array<IUser> = await this._controller.getDelegation(
                    user.userId,
                    req.params.id,
                );
                res.status(200).json(result);
            } catch (error) {
                next(error);
            }
        });
        this._router.delete('/', async (req: Request, res: Response, next: NextFunction) => {
            try {
                const user: IUser = res.locals['user'];
                const result: boolean = await this._controller.deleteDelegations(user.userId);
                res.status(200).json(result);
            } catch (error) {
                next(error);
            }
        });
        this._router.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
            try {
                const user: IUser = res.locals['user'];

                const result: boolean = await this._controller.deleteDelegation(
                    user.userId,
                    req.params.id,
                );
                res.status(200).json(result);
            } catch (error) {
                next(error);
            }
        });
        this._router.post('/:id1/:id2', async (req: Request, res: Response, next: NextFunction) => {
            try {
                const user: IUser = res.locals['user'];

                const result: boolean = await this._controller.giveDelegation(
                    user.userId,
                    req.params.id1,
                    req.params.id2,
                );
                res.status(200).json(result);
            } catch (error) {
                next(error);
            }
        });
    }
}
