import { Request, Response } from 'express';

export interface AccessTokenInterface {
    userId: string;
}
const COOKIE_NAME = 'userId_cookie';
const COOKIE_TIMEOUT = 60 * 60 * 24 * 7;

export class CookieHandler {
    /**
     * `Secure: true` which forces the connection to be `https`.
     * `HttpOnly: true` frontend web applications doesn't have access to this cookie.
     * `SameSite: None` to be able to login from the plugin without writing the credentials again.
     * @param res
     * @param data
     * @param cookieName
     * @param expirationSeconds
     */
    private static setSecureCookie = (
        res: Response,
        data: AccessTokenInterface | string,
        cookieName: string,
        expirationSeconds: number,
    ): void => {
        const expirationMilliSeconds = expirationSeconds * 1000;

        res.cookie(cookieName, data, {
            signed: true,
            httpOnly: true,
            maxAge: expirationMilliSeconds,
            secure: true,
            sameSite: true,
        });
    };
    public static set(res: Response, data: AccessTokenInterface): void {
        this.setSecureCookie(res, data, COOKIE_NAME, COOKIE_TIMEOUT);
    }
    public static getFrom(req: Request): AccessTokenInterface | undefined {
        const hasToken = req.signedCookies[COOKIE_NAME];
        return hasToken;
    }

    public static removeFrom(res: Response): void {
        this.setSecureCookie(res, '', COOKIE_NAME, 0);
    }
}
