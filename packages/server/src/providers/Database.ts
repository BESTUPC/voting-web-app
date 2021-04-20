import { Db, MongoClient } from 'mongodb';

/**
 * Class to control the MongoDB connection.
 */
export class Database {
    /**
     * Client to save the connection.
     */
    private static _client: MongoClient;

    /**
     * Create indexes to ensure that:
     * - Users collection - userId is unique.
     * - Votes collection - the pair pollId and userId is unique.
     * - askWithdrawal collection - the pair pollId and userId is unique.
     * - askPrivate collection - the pair pollId and userId is unique.
     */
    private static async createIndexes(): Promise<void> {
        await this.getDb().collection('users').createIndex({ userId: 1 }, { unique: true });
        await this.getDb()
            .collection('delegations')
            .createIndex({ userIdDelegator: 1, userIdReceiver: 1 }, { unique: true });
        await this.getDb()
            .collection('votes')
            .createIndex({ pollId: 1, userId: 1 }, { unique: true });
    }

    /**
     * Connect to the database.
     */
    public static async connect(): Promise<boolean> {
        const auth =
            process.env.NODE_ENV === 'dev'
                ? {}
                : {
                      user: process.env.MONGO_USER,
                      password: process.env.MONGO_PASSWORD,
                  };
        try {
            this._client = await MongoClient.connect(process.env.MONGO_URI, {
                useUnifiedTopology: true,
                connectTimeoutMS: parseInt(process.env.MONGO_TIMEOUT),
                serverSelectionTimeoutMS: parseInt(process.env.MONGO_TIMEOUT),
                ...auth,
            });
            await this.createIndexes();
            return true;
        } catch (e) {
            console.error("Couldn't start MongoDB connection");
            return false;
        }
    }

    /**
     * Public function to allow all controllers access to the database.
     * @returns Returns the mongoDB database instance.
     */
    public static getDb(): Db {
        return this._client.db(process.env.MONGO_DBNAME);
    }
}
