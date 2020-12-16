import { Router } from 'express';
import UserRouter from './UserRouter';
import ThemeBRouter from './ThemeBRouter';

export default class MasterRouter {
    private _router = Router();
    private _userRouter: UserRouter;
    private _subrouterB: ThemeBRouter;

    get router(): Router {
        return this._router;
    }

    constructor() {
        this._userRouter = new UserRouter();
        this._subrouterB = new ThemeBRouter();
        this._configure();
    }

    /**
     * Connect routes to their matching routers.
     */
    private _configure() {
        this._router.use('/users', this._userRouter.router);
        this._router.use('/themeB', this._subrouterB.router);
    }
}
