import { Router } from 'express';
import { validateUser } from '../utils/AuthMiddleware';
import { AuthRouter } from './AuthRouter';
import { DelegationRouter } from './DelegationRouter';
import { PollRouter } from './PollRouter';
import { UserRouter } from './UserRouter';
import { VoteRouter } from './VoteRouter';

/**
 * Class to unite all the routers.
 */
export class MasterRouter {
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
     * Vote router instance.
     */
    private _voteRouter: VoteRouter;

    /**
     * Delegation router instance.
     */
    private _delegationRouter: DelegationRouter;

    /**
     * Auth router instance.
     */
    private _authRouter: AuthRouter;

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
        this._delegationRouter = new DelegationRouter();
        this._authRouter = new AuthRouter();
        this._configure();
    }

    /**
     * Connect routes to their matching routers.
     */
    private _configure() {
        this._router.use('/users', [validateUser()], this._userRouter.router);
        this._router.use('/polls', [validateUser()], this._pollRouter.router);
        this._router.use('/votes', [validateUser()], this._voteRouter.router);
        this._router.use('/delegations', [validateUser()], this._delegationRouter.router);
        this._router.use('/auth', [validateUser(false)], this._authRouter.router);
    }
}
