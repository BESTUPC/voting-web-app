**[webapp](../README.md)**

> [Globals](../globals.md) / [providers](../modules/providers.md) / Database

# Class: Database

Class to control the MongoDB connection.

## Hierarchy

* **Database**

## Index

### Properties

* [\_client](providers.database.md#_client)

### Methods

* [connect](providers.database.md#connect)
* [createIndexes](providers.database.md#createindexes)
* [getDb](providers.database.md#getdb)

## Properties

### \_client

▪ `Static` `Private` **\_client**: MongoClient

*Defined in [src/providers/Database.ts:10](https://github.com/BESTUPC/voting-web-app/blob/3f5c425/src/providers/Database.ts#L10)*

Client to save the connection.

## Methods

### connect

▸ `Static`**connect**(): Promise<void\>

*Defined in [src/providers/Database.ts:37](https://github.com/BESTUPC/voting-web-app/blob/3f5c425/src/providers/Database.ts#L37)*

Connect to the database.

**Returns:** Promise<void\>

___

### createIndexes

▸ `Static` `Private`**createIndexes**(): Promise<void\>

*Defined in [src/providers/Database.ts:19](https://github.com/BESTUPC/voting-web-app/blob/3f5c425/src/providers/Database.ts#L19)*

Create indexes to ensure that:
- Users collection - userId is unique.
- Votes collection - the pair pollId and userId is unique.
- askWithdrawal collection - the pair pollId and userId is unique.
- askPrivate collection - the pair pollId and userId is unique.

**Returns:** Promise<void\>

___

### getDb

▸ `Static`**getDb**(): Db

*Defined in [src/providers/Database.ts:54](https://github.com/BESTUPC/voting-web-app/blob/3f5c425/src/providers/Database.ts#L54)*

Public function to allow all controllers access to the database.

**Returns:** Db

Returns the mongoDB database instance.
