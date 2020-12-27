import express, { NextFunction, Request, Response, Express } from 'express';
import fs from 'fs';
import http from 'http';
import https from 'https';
import bodyParser from 'body-parser';

import MasterRouter from '../routers/MasterRouter';
import ErrorHandler from '../models/ErrorHandler';

import { ICertificates } from '../interfaces/ICertificates';

/**
 * Custom server application class.
 */
export default class Server {
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
        this.server.use(function (_req, res, next) {
            res.header('Access-Control-Allow-Origin', '*');
            res.header(
                'Access-Control-Allow-Headers',
                'Origin, X-Requested-With, Content-Type, Accept',
            );
            next();
        });
        this.server.use(bodyParser.urlencoded({ extended: false }));
        this.server.use(bodyParser.json());
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
        this.server.use(express.static('public'));
        this.server.use('/api', new MasterRouter().router);
    }

    /**
     * Gets the SSL certificates.
     * @returns the SSL certificates if found or null otherwise.
     */
    private static _getCertificates(): ICertificates | null {
        if (
            fs.existsSync(process.env.CERT_PATH + 'privkey.pem') &&
            fs.existsSync(process.env.CERT_PATH + 'cert.pem') &&
            fs.existsSync(process.env.CERT_PATH + 'chain.pem')
        ) {
            const certificate: ICertificates = {
                key: fs.readFileSync(
                    process.env.CERT_PATH + 'privkey.pem',
                    'utf8',
                ),
                cert: fs.readFileSync(
                    process.env.CERT_PATH + 'cert.pem',
                    'utf8',
                ),
                ca: fs.readFileSync(
                    process.env.CERT_PATH + 'chain.pem',
                    'utf8',
                ),
            };
            return certificate;
        } else {
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
    public configure(): void {
        this._mountMiddlewares();
        this._mountRoutes();
    }

    /**
     * Start the server. If possible it will run both a HTTP and HTTPS port.
     */
    public listen(): void {
        const certificate: ICertificates | null = Server._getCertificates();
        if (certificate) {
            const httpServer: http.Server = http.createServer(this.server);
            const httpsServer: https.Server = https.createServer(
                certificate,
                this.server,
            );

            httpServer.listen(process.env.PORT2, () => {
                console.log('HTTP Server running on port ' + process.env.PORT2);
            });

            httpsServer.listen(process.env.PORT1, () => {
                console.log(
                    'HTTPS Server running on port ' + process.env.PORT1,
                );
            });
        } else {
            console.log('No https certificates found, opening only http');
            const httpServer = http.createServer(this.server);
            httpServer.listen(process.env.PORT1, () => {
                console.log('HTTP Server running on port ' + process.env.PORT1);
            });
        }
    }
}
