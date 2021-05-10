import dotenv from 'dotenv';
import 'reflect-metadata';

import { Server } from './providers/Server';
import { Authentication } from './providers/Authentication';
import { Database } from './providers/Database';

dotenv.config({
    path: '.env',
});

/**
 * Final application class
 */
class App {
    /**
     * Custom application instance
     */
    private server: Server;
    /**
     * Server class constructor
     */
    constructor() {
        this.server = new Server();
    }

    /**
     * Connect the database, configure the server and start it.
     */
    public async start(): Promise<void> {
        if (
            !(
                (await Database.connect()) &&
                this.server.mountMiddlewares() &&
                //(await Authentication.configure(this.server.getServer())) &&
                this.server.mountRoutes() &&
                (await this.server.listen())
            )
        ) {
            console.info('Shutting down app.');
            process.exit(22);
        }
    }
}

// Start the server
const app: App = new App();
app.start();
