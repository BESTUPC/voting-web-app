**[webapp](../README.md)**

> [Globals](../globals.md) / ["providers/Database"](../modules/_providers_database_.md) / Database

# Class: Database

## Hierarchy

* **Database**

## Index

### Properties

* [client](_providers_database_.database.md#client)

### Methods

* [connect](_providers_database_.database.md#connect)
* [createIndexes](_providers_database_.database.md#createindexes)
* [getDb](_providers_database_.database.md#getdb)

## Properties

### client

▪ `Static` `Private` **client**: MongoClient

*Defined in [src/providers/Database.ts:4](https://github.com/BESTUPC/voting-web-app/blob/08738de/src/providers/Database.ts#L4)*

## Methods

### connect

▸ `Static`**connect**(): Promise<void\>

*Defined in [src/providers/Database.ts:20](https://github.com/BESTUPC/voting-web-app/blob/08738de/src/providers/Database.ts#L20)*

**Returns:** Promise<void\>

___

### createIndexes

▸ `Static` `Private`**createIndexes**(): Promise<void\>

*Defined in [src/providers/Database.ts:5](https://github.com/BESTUPC/voting-web-app/blob/08738de/src/providers/Database.ts#L5)*

**Returns:** Promise<void\>

___

### getDb

▸ `Static`**getDb**(): Db

*Defined in [src/providers/Database.ts:34](https://github.com/BESTUPC/voting-web-app/blob/08738de/src/providers/Database.ts#L34)*

**Returns:** Db
