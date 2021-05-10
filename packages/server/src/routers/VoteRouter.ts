import { NextFunction, Request, Response, Router } from 'express';
import { VoteController } from '../controllers/VoteController';
import { IUser, IVote } from 'interfaces';

export class VoteRouter {
    /**
     * Express router instance.
     */
    private _router = Router();

    /**
     * Controller to use in this router.
     */
    private _controller = VoteController;

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
        this._router.get(
            '/:userId/:pollId',
            async (req: Request, res: Response, next: NextFunction) => {
                try {
                    const user: IUser = res.locals['user'];
                    const result: IVote = await this._controller.getVote(
                        user.userId,
                        req.params.userId,
                        req.params.pollId,
                    );
                    res.status(200).json(result);
                } catch (error) {
                    next(error);
                }
            },
        );
        this._router.post('/', async (req: Request, res: Response, next: NextFunction) => {
            try {
                const user: IUser = res.locals['user'];
                const result: boolean = await this._controller.addorUpdateVote(
                    user.userId,
                    req.body,
                );
                res.status(200).json(result);
            } catch (error) {
                next(error);
            }
        });
        this._router.post(
            '/:givenDelegationId',
            async (req: Request, res: Response, next: NextFunction) => {
                try {
                    const user: IUser = res.locals['user'];
                    const result: boolean = await this._controller.addorUpdateVote(
                        user.userId,
                        req.body,
                        req.params.givenDelegationId,
                    );
                    res.status(200).json(result);
                } catch (error) {
                    next(error);
                }
            },
        );
    }
}
