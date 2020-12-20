import { Router } from 'express';
import UserRouter from './UserRouter';
import PollRouter from './PollRouter';

export default class MasterRouter {
    private _router = Router();
    private _userRouter: UserRouter;
    private _pollRouter: PollRouter;

    get router(): Router {
        return this._router;
    }

    constructor() {
        this._userRouter = new UserRouter();
        this._pollRouter = new PollRouter();
        this._configure();
    }

    /**
     * Connect routes to their matching routers.
     */
    private _configure() {
        this._router.use('/users', this._userRouter.router);
        this._router.use('/polls', this._pollRouter.router);
    }
}
