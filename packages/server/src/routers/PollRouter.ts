import { NextFunction, Request, Response, Router } from 'express';
import { PollController } from '../controllers/PollController';
import { IPoll, IUser } from 'interfaces';

export class PollRouter {
    /**
     * Express router instance.
     */
    private _router = Router();

    /**
     * Controller to use in this router.
     */
    private _controller = PollController;

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
                const result: Array<IPoll> = await this._controller.getPolls(user.userId);
                res.status(200).json(result);
            } catch (error) {
                next(error);
            }
        });
        this._router.patch(
            '/state/:id',
            async (req: Request, res: Response, next: NextFunction) => {
                try {
                    const user: IUser = res.locals['user'];
                    const result: boolean = await this._controller.updateState(
                        user.userId,
                        req.params.id,
                    );
                    res.status(200).json(result);
                } catch (error) {
                    next(error);
                }
            },
        );
        this._router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
            try {
                const user: IUser = res.locals['user'];
                const result: IPoll = await this._controller.getPoll(user.userId, req.params.id);
                res.status(200).json(result);
            } catch (error) {
                next(error);
            }
        });
        this._router.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
            try {
                const user: IUser = res.locals['user'];
                const result: boolean = await this._controller.deletePoll(
                    user.userId,
                    req.params.id,
                );
                res.status(200).json(result);
            } catch (error) {
                next(error);
            }
        });
        this._router.post('/', async (req: Request, res: Response, next: NextFunction) => {
            try {
                const user: IUser = res.locals['user'];
                const result: boolean = await this._controller.addPoll(user.userId, req.body);
                res.status(200).json(result);
            } catch (error) {
                next(error);
            }
        });
    }
}
