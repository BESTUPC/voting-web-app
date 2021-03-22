import dotenv from 'dotenv';
import 'reflect-metadata';

import Server from './providers/Server';
import Authentication from './providers/Authentication';
import Database from './providers/Database';
import Logger from './utils/Logger';

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
                (await Authentication.configure(this.server.getServer())) &&
                this.server.configure() &&
                (await this.server.listen())
            )
        ) {
            Logger.info('Shutting down app.');
            process.exit(22);
        }
    }
}

// Start the server
const app: App = new App();
app.start();
