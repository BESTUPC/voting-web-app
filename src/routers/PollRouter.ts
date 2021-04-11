import { NextFunction, Request, Response, Router } from 'express';
import PollController from '../controllers/PollController';
import { IPoll } from '../interfaces/IPoll';

export default class PollRouter {
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
        this._router.get(
            '/',
            async (req: Request, res: Response, next: NextFunction) => {
                try {
                    const result: Array<IPoll> = await this._controller.getPolls(
                        req.user['id'],
                    );
                    res.status(200).json(result);
                } catch (error) {
                    next(error);
                }
            },
        );
        this._router.patch(
            '/state/:id',
            async (req: Request, res: Response, next: NextFunction) => {
                try {
                    const result: boolean = await this._controller.updateState(
                        req.user['id'],
                        req.params.id,
                    );
                    res.status(200).json(result);
                } catch (error) {
                    next(error);
                }
            },
        );
        this._router.get(
            '/:id',
            async (req: Request, res: Response, next: NextFunction) => {
                try {
                    const result: IPoll = await this._controller.getPoll(
                        req.user['id'],
                        req.params.id,
                    );
                    res.status(200).json(result);
                } catch (error) {
                    next(error);
                }
            },
        );
        this._router.delete(
            '/:id',
            async (req: Request, res: Response, next: NextFunction) => {
                try {
                    const result: boolean = await this._controller.deletePoll(
                        req.user['id'],
                        req.params.id,
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
                    const result: boolean = await this._controller.addPoll(
                        req.user['id'],
                        req.body,
                    );
                    res.status(200).json(result);
                } catch (error) {
                    next(error);
                }
            },
        );
    }
}
