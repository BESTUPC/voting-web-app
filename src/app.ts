import dotenv from 'dotenv';

import Server from './providers/Server';
import Authentication from './providers/Authentication';
import Database from './providers/Database';

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
        await Database.connect();
        Authentication.configure(this.server.getServer());
        this.server.configure();
        this.server.listen();
    }
}

// Start the server
const app: App = new App();
app.start();
