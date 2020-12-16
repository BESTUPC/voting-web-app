import { Express, NextFunction, Request, Response } from 'express';
import passport from 'passport';
import { OAuth2Strategy } from 'passport-google-oauth';
import cookieSession from 'cookie-session';
import fs from 'fs';
import { ICredentials } from '../interface/ICredentials';

export default abstract class Authentication {
    public static configure(app: Express): void {
        passport.serializeUser(function (user, done) {
            done(null, user);
        });
        passport.deserializeUser(function (user, done) {
            done(null, user);
        });
        const creds: ICredentials | null = Authentication._getCredentials();
        if (!creds) {
            return null;
        } else {
            passport.use(
                new OAuth2Strategy(
                    creds,
                    function (_accessToken, _refreshToken, profile, done) {
                        return done(null, profile);
                    },
                ),
            );
        }
        app.use(
            cookieSession({
                name: 'google-auth-session',
                keys: [process.env.COOKIE_KEY1, process.env.COOKIE_KEY2],
            }),
        );
        app.use(passport.initialize());
        app.use(passport.session());

        app.get(
            '/auth',
            passport.authenticate('google', { scope: ['profile', 'email'] }),
        );
        app.get(
            '/auth/redirect',
            passport.authenticate('google', { failureRedirect: '/login.html' }),
            function (req, res) {
                res.redirect('/');
            },
        );
        app.get('/auth/logout', (req, res) => {
            req.session = null;
            req.logout();
            res.redirect('/login.html');
        });
        app.use(Authentication._isLoggedIn);
    }

    private static _getCredentials(): ICredentials | null {
        if (fs.existsSync(process.env.CRED_PATH)) {
            try {
                const parsedCreds = JSON.parse(
                    fs.readFileSync(process.env.CRED_PATH, 'utf8'),
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
        } else {
            return null;
        }
    }

    private static _isLoggedIn(
        req: Request,
        res: Response,
        next: NextFunction,
    ): void {
        const route: string = req.headers.referer
            ? req.headers.referer
            : req.path;
        if (req.isAuthenticated() || route.includes('/login.html')) {
            next();
        } else {
            res.redirect('/login.html');
        }
    }
}
