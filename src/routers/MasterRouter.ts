import { Router } from 'express';
import UserRouter from './UserRouter';
import PollRouter from './PollRouter';
import VoteRouter from './VoteRouter';

/**
 * Class to unite all the routers.
 */
export default class MasterRouter {
    /**
     * Express router instance.
     */
    private _router = Router();

    /**
     * User router instance.
     */
    private _userRouter: UserRouter;

    /**
     * Poll router instance.
     */
    private _pollRouter: PollRouter;

    /**
     * VOte router instance.
     */
    private _voteRouter: VoteRouter;

    /**
     * Get function for the express router.
     */
    get router(): Router {
        return this._router;
    }

    /**
     * Creates all the subrouters and configures the main one.
     */
    constructor() {
        this._userRouter = new UserRouter();
        this._pollRouter = new PollRouter();
        this._voteRouter = new VoteRouter();
        this._configure();
    }

    /**
     * Connect routes to their matching routers.
     */
    private _configure() {
        this._router.use('/users', this._userRouter.router);
        this._router.use('/polls', this._pollRouter.router);
        this._router.use('/votes', this._voteRouter.router);
    }
}
