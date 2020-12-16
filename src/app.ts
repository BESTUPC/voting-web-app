import dotenv from 'dotenv';

import Server from './providers/Server';
import Authentication from './providers/Authentication';
import Database from './providers/Database';

dotenv.config({
    path: '.env',
});

/**
 * Express server application class
 * @description Will later contain the routing system
 */
class App {
    private server: Server;
    /**
     * Server class constructor
     */
    constructor() {
        this.server = new Server();
    }

    public async start(): Promise<void> {
        await Database.connect();
        Authentication.configure(this.server.getServer());
        this.server.configure();
        this.server.listen();
    }
}

// initialize server app
const app: App = new App();
app.start();
