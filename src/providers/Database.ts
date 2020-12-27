import { Db, MongoClient } from 'mongodb';

/**
 * Class to control the MongoDB connection.
 */
export default class Database {
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
        await this.getDb()
            .collection('users')
            .createIndex({ userId: 1 }, { unique: true });
        await this.getDb()
            .collection('votes')
            .createIndex({ pollId: 1, userId: 1 }, { unique: true });
        await this.getDb()
            .collection('askWithdrawal')
            .createIndex({ pollId: 1, userId: 1 }, { unique: true });
        await this.getDb()
            .collection('askPrivate')
            .createIndex({ pollId: 1, userId: 1 }, { unique: true });
    }

    /**
     * Connect to the database.
     */
    public static async connect(): Promise<void> {
        try {
            this._client = await MongoClient.connect(process.env.MONGO_URI, {
                useUnifiedTopology: true,
                connectTimeoutMS: parseInt(process.env.MONGO_TIMEOUT),
                serverSelectionTimeoutMS: parseInt(process.env.MONGO_TIMEOUT),
            });
            await this.createIndexes();
        } catch (e) {
            return null;
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
