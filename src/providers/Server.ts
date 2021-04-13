import express, { Express, NextFunction, Request, Response } from 'express';
import fs from 'fs';
import helmet from 'helmet';
import https from 'https';
import path from 'path';
import { ICertificates } from '../interfaces/ICertificates';
import { MasterRouter } from '../routers/MasterRouter';
import { ErrorHandler } from '../utils/ErrorHandler';
import { Logger } from '../utils/Logger';
import { morganMiddleware } from '../utils/MorganMiddleware';

/**
 * Custom server application class.
 */
export class Server {
    /**
     * Express server instance to setup.
     */
    private server: Express;

    /**
     * Server class constructor.
     */
    constructor() {
        this.server = express();
    }

    /**
     * Mounts the body parser and custom error handler middlewares.
     */
    private _mountMiddlewares(): void {
        this.server.use(helmet());
        this.server.use(
            helmet.contentSecurityPolicy({
                directives: {
                    defaultSrc: ["'self'"],
                    scriptSrc: ["'self'", 'cdn.jsdelivr.net'],
                    styleSrc: ["'self'", 'cdn.jsdelivr.net'],
                    fontSrc: ["'self'", 'cdn.jsdelivr.net'],
                },
            }),
        );
        this.server.use(function (_req, res, next) {
            res.header('Access-Control-Allow-Origin', '*');
            res.header(
                'Access-Control-Allow-Headers',
                'Origin, X-Requested-With, Content-Type, Accept',
            );
            next();
        });
        this.server.use(morganMiddleware);
        this.server.use(express.json());
        this.server.use(express.urlencoded({ extended: true }));
        this.server.use(
            (
                err: ErrorHandler,
                _req: Request,
                res: Response,
                _next: NextFunction,
            ) => {
                res.status(err.statusCode || 500).json({
                    status: 'error',
                    statusCode: err.statusCode,
                    message: err.message,
                });
            },
        );
    }

    /**
     * Configures the file serving and the api route.
     */
    private _mountRoutes(): void {
        this.server.use('/api', new MasterRouter().router);
    }

    /**        console.log(path.join(process.env.ROOT_DIR, 'public'));

     * Gets the SSL certificates.
     * @returns the SSL certificates if found or null otherwise.
     */
    private static async _getCertificates(): Promise<ICertificates | null> {
        try {
            const certificate: ICertificates = {
                key: await fs.promises.readFile(
                    process.env.CERT_PATH + 'privkey.pem',
                    'utf8',
                ),
                cert: await fs.promises.readFile(
                    process.env.CERT_PATH + 'cert.pem',
                    'utf8',
                ),
                ca: await fs.promises.readFile(
                    process.env.CERT_PATH + 'chain.pem',
                    'utf8',
                ),
            };
            return certificate;
        } catch {
            return null;
        }
    }

    /**
     * Function to access the server to share it with other providers.
     */
    public getServer(): Express {
        return this.server;
    }

    /**
     * Call the mount functions.
     */
    public configure(): boolean {
        try {
            this.server.use(
                '/',
                express.static(path.join(process.env.ROOT_DIR, 'public')),
            );
            this._mountMiddlewares();
            this._mountRoutes();
            return true;
        } catch {
            Logger.error("Couldn't configure server routes and middlewares");
            return false;
        }
    }

    /**
     * Start the server. If possible it will run both a HTTP and HTTPS port.
     */
    public async listen(): Promise<boolean> {
        const certificate: ICertificates | null = await Server._getCertificates();
        if (certificate) {
            const httpsServer: https.Server = https.createServer(
                certificate,
                this.server,
            );
            httpsServer.listen(process.env.PORT1, () => {
                Logger.info(
                    'HTTPS Server running on port ' + process.env.PORT1,
                );
            });
            return true;
        } else {
            Logger.error("Couldn't run server, no certificates found");
            return false;
        }
    }
}
