**[webapp](../README.md)**

> [Globals](../globals.md) / [providers](../modules/providers.md) / Database

# Class: Database

## Hierarchy

* **Database**

## Index

### Properties

* [client](providers.database.md#client)

### Methods

* [connect](providers.database.md#connect)
* [createIndexes](providers.database.md#createindexes)
* [getDb](providers.database.md#getdb)

## Properties

### client

▪ `Static` `Private` **client**: MongoClient

*Defined in [src/providers/Database.ts:4](https://github.com/BESTUPC/voting-web-app/blob/67fed0c/src/providers/Database.ts#L4)*

## Methods

### connect

▸ `Static`**connect**(): Promise<void\>

*Defined in [src/providers/Database.ts:20](https://github.com/BESTUPC/voting-web-app/blob/67fed0c/src/providers/Database.ts#L20)*

**Returns:** Promise<void\>

___

### createIndexes

▸ `Static` `Private`**createIndexes**(): Promise<void\>

*Defined in [src/providers/Database.ts:5](https://github.com/BESTUPC/voting-web-app/blob/67fed0c/src/providers/Database.ts#L5)*

**Returns:** Promise<void\>

___

### getDb

▸ `Static`**getDb**(): Db

*Defined in [src/providers/Database.ts:34](https://github.com/BESTUPC/voting-web-app/blob/67fed0c/src/providers/Database.ts#L34)*

**Returns:** Db
