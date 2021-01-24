import { NextFunction, Request, Response, Router } from 'express';
import VoteController from '../controllers/VoteController';
import { IPoll } from '../interfaces/IPoll';
import { IVote } from '../interfaces/IVote';

export default class VoteRouter {
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
                    const result: IVote = await this._controller.getVote(
                        req.user['id'],
                        req.params.userId,
                        req.params.pollId,
                    );
                    res.status(200).json(result);
                } catch (error) {
                    next(error);
                }
            },
        );
        this._router.post(
            '/',
            async (req: Request, res: Response, next: NextFunction) => {
                try {
                    const result: boolean = await this._controller.addorUpdateVote(
                        req.user['id'],
                        JSON.parse(JSON.stringify(req.body)),
                    );
                    res.status(200).json(result);
                } catch (error) {
                    next(error);
                }
            },
        );
        this._router.post(
            '/:givenDelegationId',
            async (req: Request, res: Response, next: NextFunction) => {
                try {
                    const result: boolean = await this._controller.addorUpdateVote(
                        req.params.givenDelegationId,
                        JSON.parse(JSON.stringify(req.body)),
                    );
                    res.status(200).json(result);
                } catch (error) {
                    next(error);
                }
            },
        );
    }
}