import { Db, MongoClient } from 'mongodb';

export default class Database {
    private static client: MongoClient;
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

    public static async connect(): Promise<void> {
        try {
            this.client = await MongoClient.connect(process.env.MONGO_URI, {
                useUnifiedTopology: true,
                connectTimeoutMS: parseInt(process.env.MONGO_TIMEOUT),
                serverSelectionTimeoutMS: parseInt(process.env.MONGO_TIMEOUT),
            });
            await this.createIndexes();
        } catch (e) {
            console.log(e);
            return null;
        }
    }

    public static getDb(): Db {
        return this.client.db(process.env.MONGO_DBNAME);
    }
}
