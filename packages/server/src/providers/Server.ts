import cors from 'cors';
import express, { Express, NextFunction, Request, Response } from 'express';
import fs from 'fs';
import helmet from 'helmet';
import https from 'https';
import { ICertificates } from 'interfaces';
import morgan from 'morgan';
import { MasterRouter } from '../routers/MasterRouter';
import { ErrorHandler } from '../utils/ErrorHandler';
import cookieParser from 'cookie-parser';

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
    private _mountMiddlewares(): boolean {
        try {
            this.server.use(helmet());

            this.server.use(
                cors({
                    origin: 'https://localhost:4200',
                    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
                    credentials: true,
                }),
            );
            this.server.use(cookieParser(process.env.COOKIE_KEY1));
            this.server.use(morgan('tiny'));
            this.server.use(express.json());
            this.server.use(express.urlencoded({ extended: true }));
            this.server.use(
                (err: ErrorHandler, _req: Request, res: Response, _next: NextFunction) => {
                    res.status(err.statusCode || 500).json({
                        status: 'error',
                        statusCode: err.statusCode,
                        message: err.message,
                    });
                },
            );
            return true;
        } catch (e) {
            console.error('Unable to mount middlewares');
            return false;
        }
    }

    /**
     * Configures the file serving and the api route.
     */
    private _mountRoutes(): boolean {
        try {
            this.server.use('/api', new MasterRouter().router);
            return true;
        } catch (e) {
            console.error('Unable to mount routes');
            return false;
        }
    }

    /**        console.log(path.join(process.env.ROOT_DIR, 'public'));

     * Gets the SSL certificates.
     * @returns the SSL certificates if found or null otherwise.
     */
    private static async _getCertificates(): Promise<ICertificates | null> {
        try {
            const certificate: ICertificates = {
                key: await fs.promises.readFile(process.env.CERT_PATH + 'privkey.pem', 'utf8'),
                cert: await fs.promises.readFile(process.env.CERT_PATH + 'cert.pem', 'utf8'),
                ca: await fs.promises.readFile(process.env.CERT_PATH + 'chain.pem', 'utf8'),
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
            this._mountMiddlewares();
            this._mountRoutes();
            return true;
        } catch {
            console.error("Couldn't configure server routes and middlewares");
            return false;
        }
    }

    /**
     * Start the server. If possible it will run both a HTTP and HTTPS port.
     */
    public async listen(): Promise<boolean> {
        const certificate: ICertificates | null = await Server._getCertificates();
        if (certificate) {
            const httpsServer: https.Server = https.createServer(certificate, this.server);
            httpsServer.listen(process.env.PORT1, () => {
                console.info('HTTPS Server running on port ' + process.env.PORT1);
            });
            return true;
        } else {
            console.error("Couldn't run server, no certificates found");
            return false;
        }
    }
}