import { Express, NextFunction, Request, Response } from 'express';
import passport from 'passport';
import { OAuth2Strategy, Profile } from 'passport-google-oauth';
import cookieSession from 'cookie-session';
import fs from 'fs';
import dotenv from 'dotenv';

import { ICredentials } from '../interfaces/ICredentials';
import { UserController } from '../controllers/UserController';

dotenv.config({
    path: '.env',
});
/**
 * Class to setup the Passport.js and cookie-session middleware.
 */
export abstract class Authentication {
    /**
     * Mounts the authentication endpoints.
     * @param app Express app to setup.
     */
    private static _mountAuthEndpoints(app: Express): void {
        app.get(
            '/auth',
            passport.authenticate('google', {
                scope: ['profile', 'email'],
            }),
        );
        app.get(
            '/auth/redirect',
            passport.authenticate('google', {
                failureRedirect: '/login.html',
            }),
            function (_req, res) {
                res.redirect('/');
            },
        );
        app.get('/auth/logout', async (req, res) => {
            req.session = null;
            req.logout();
            res.redirect('/login.html');
        });
        app.use(Authentication._isLoggedIn);
    }

    /**
     * Sets up the Passport.js OAuth2 strategy.
     * @param creds The GoogleAuth credentials.
     */
    private static _setupPassport(creds: ICredentials) {
        passport.serializeUser(function (user, done) {
            done(null, user);
        });
        passport.deserializeUser(function (user, done) {
            done(null, user);
        });
        passport.use(
            new OAuth2Strategy(
                creds,
                async function (
                    _accessToken: string,
                    _refreshToken: string,
                    profile: Profile,
                    done,
                ) {
                    await UserController.addUser(profile);
                    return done(null, profile);
                },
            ),
        );
    }

    /**
     * Configures the serialization of user, gets the OAuth Google credentials, sets up the cookie session and the authentication endpoints.
     * @param app Express app to setup.
     */
    public static async configure(app: Express): Promise<boolean> {
        const creds: ICredentials | null = await Authentication._getCredentials();
        if (creds) {
            Authentication._setupPassport(creds);
            app.use(
                cookieSession({
                    name: 'google-auth-session',
                    keys: [process.env.COOKIE_KEY1, process.env.COOKIE_KEY2],
                }),
            );
            app.use(passport.initialize());
            app.use(passport.session());
            Authentication._mountAuthEndpoints(app);
            return true;
        } else {
            console.error("Couldn't setup authentication middleware");
            return false;
        }
    }

    /**
     * In charge of opening the files with Google OAuth credentials.
     * @returns Returns the credentials obtained or null if not found.
     */
    private static async _getCredentials(): Promise<ICredentials | null> {
        try {
            const parsedCreds = JSON.parse(
                await fs.promises.readFile(process.env.CRED_PATH, 'utf8'),
            );
            const creds: ICredentials = {
                clientID: parsedCreds['web']['client_id'],
                clientSecret: parsedCreds['web']['client_secret'],
                callbackURL: parsedCreds['web']['redirect_uris'][2],
            };
            return creds;
        } catch {
            return null;
        }
    }

    /**
     * Auxiliary middleware function to controll logged in access.
     * @param req server request.
     * @param res response to the request.
     * @param next function to execute next.
     */
    private static _isLoggedIn(
        req: Request,
        res: Response,
        next: NextFunction,
    ): void {
        const auxRef: string =
            (req.headers.referer ? req.headers.referer : '') + req.path;
        if (req.isAuthenticated() || auxRef.includes('/login.html')) {
            next();
        } else {
            res.redirect('/login.html');
        }
    }
}
