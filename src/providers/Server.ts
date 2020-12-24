import express, { NextFunction, Request, Response, Express } from 'express';
import fs from 'fs';
import http from 'http';
import https from 'https';
import bodyParser from 'body-parser';

import MasterRouter from '../routers/MasterRouter';
import ErrorHandler from '../models/ErrorHandler';

import { ICertificates } from '../interfaces/ICertificates';

/**
 * Express server application class
 * @description Will later contain the routing system
 */
export default class Server {
    private server: Express;

    /**
     * Server class constructor
     */
    constructor() {
        this.server = express();
    }

    /**
     * mountMiddlewares
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
        //Here we are configuring express to use body-parser as middle-ware.
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
     * mountRoutes
     */
    private _mountRoutes(): void {
        this.server.use(express.static('public'));
        this.server.use('/api', new MasterRouter().router);
    }

    /**
     * getCertificates
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

    public getServer(): Express {
        return this.server;
    }

    public configure(): void {
        this._mountMiddlewares();
        this._mountRoutes();
    }

    /**
     * listen
     */
    public listen(): void {
        const certificate: ICertificates | null = Server._getCertificates();
        if (certificate) {
            const httpServer: http.Server = http.createServer(this.server);
            const httpsServer: https.Server = https.createServer(
                certificate,
                this.server,
            );

            //also open http on other port
            httpServer.listen(process.env.PORT2, () => {
                console.log('HTTP Server running on port ' + process.env.PORT2);
            });

            httpsServer.listen(process.env.PORT1, () => {
                console.log(
                    'HTTPS Server running on port ' + process.env.PORT1,
                );
            });
        } else {
            //we dont have the certificates, open http only
            console.log('No https certificates found, opening only http');
            const httpServer = http.createServer(this.server);
            httpServer.listen(process.env.PORT1, () => {
                console.log('HTTP Server running on port ' + process.env.PORT1);
            });
        }
    }
}
