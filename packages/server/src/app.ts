import dotenv from 'dotenv';
import 'reflect-metadata';

import { Server } from './providers/Server';
import { Database } from './providers/Database';
import { logger } from './utils/CustomLogger';

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
            !((await Database.connect()) && this.server.configure() && (await this.server.listen()))
        ) {
            logger.info('Shutting down app.');
            process.exit(22);
        }
    }
}

// Start the server
const app: App = new App();
app.start();
