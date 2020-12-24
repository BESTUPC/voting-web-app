**[webapp](../README.md)**

> [Globals](../globals.md) / [providers](../modules/providers.md) / Server

# Class: Server

Express server application class

**`description`** Will later contain the routing system

## Hierarchy

* **Server**

## Index

### Constructors

* [constructor](providers.server.md#constructor)

### Properties

* [server](providers.server.md#server)

### Methods

* [\_mountMiddlewares](providers.server.md#_mountmiddlewares)
* [\_mountRoutes](providers.server.md#_mountroutes)
* [configure](providers.server.md#configure)
* [getServer](providers.server.md#getserver)
* [listen](providers.server.md#listen)
* [\_getCertificates](providers.server.md#_getcertificates)

## Constructors

### constructor

\+ **new Server**(): [Server](providers.server.md)

*Defined in [src/providers/Server.ts:17](https://github.com/BESTUPC/voting-web-app/blob/67fed0c/src/providers/Server.ts#L17)*

Server class constructor

**Returns:** [Server](providers.server.md)

## Properties

### server

• `Private` **server**: Express

*Defined in [src/providers/Server.ts:17](https://github.com/BESTUPC/voting-web-app/blob/67fed0c/src/providers/Server.ts#L17)*

## Methods

### \_mountMiddlewares

▸ `Private`**_mountMiddlewares**(): void

*Defined in [src/providers/Server.ts:29](https://github.com/BESTUPC/voting-web-app/blob/67fed0c/src/providers/Server.ts#L29)*

mountMiddlewares

**Returns:** void

___

### \_mountRoutes

▸ `Private`**_mountRoutes**(): void

*Defined in [src/providers/Server.ts:60](https://github.com/BESTUPC/voting-web-app/blob/67fed0c/src/providers/Server.ts#L60)*

mountRoutes

**Returns:** void

___

### configure

▸ **configure**(): void

*Defined in [src/providers/Server.ts:98](https://github.com/BESTUPC/voting-web-app/blob/67fed0c/src/providers/Server.ts#L98)*

**Returns:** void

___

### getServer

▸ **getServer**(): Express

*Defined in [src/providers/Server.ts:94](https://github.com/BESTUPC/voting-web-app/blob/67fed0c/src/providers/Server.ts#L94)*

**Returns:** Express

___

### listen

▸ **listen**(): void

*Defined in [src/providers/Server.ts:106](https://github.com/BESTUPC/voting-web-app/blob/67fed0c/src/providers/Server.ts#L106)*

listen

**Returns:** void

___

### \_getCertificates

▸ `Static` `Private`**_getCertificates**(): [ICertificates](../interfaces/interface.icertificates.md) \| null

*Defined in [src/providers/Server.ts:68](https://github.com/BESTUPC/voting-web-app/blob/67fed0c/src/providers/Server.ts#L68)*

getCertificates

**Returns:** [ICertificates](../interfaces/interface.icertificates.md) \| null
