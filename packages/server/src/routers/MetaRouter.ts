import { NextFunction, Request, Response, Router } from 'express';

export class MetaRouter {
    /**
     * Express router instance.
     */
    private _router = Router();

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
                res.status(200).json('Server online!');
            } catch (error) {
                next(error);
            }
        });
    }
}
