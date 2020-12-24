**[webapp](../README.md)**

> [Globals](../globals.md) / ["providers/Server"](../modules/_providers_server_.md) / Server

# Class: Server

Express server application class

**`description`** Will later contain the routing system

## Hierarchy

* **Server**

## Index

### Constructors

* [constructor](_providers_server_.server.md#constructor)

### Properties

* [server](_providers_server_.server.md#server)

### Methods

* [\_mountMiddlewares](_providers_server_.server.md#_mountmiddlewares)
* [\_mountRoutes](_providers_server_.server.md#_mountroutes)
* [configure](_providers_server_.server.md#configure)
* [getServer](_providers_server_.server.md#getserver)
* [listen](_providers_server_.server.md#listen)
* [\_getCertificates](_providers_server_.server.md#_getcertificates)

## Constructors

### constructor

\+ **new Server**(): [Server](_providers_server_.server.md)

*Defined in [src/providers/Server.ts:17](https://github.com/BESTUPC/voting-web-app/blob/a4ae6c9/src/providers/Server.ts#L17)*

Server class constructor

**Returns:** [Server](_providers_server_.server.md)

## Properties

### server

• `Private` **server**: Express

*Defined in [src/providers/Server.ts:17](https://github.com/BESTUPC/voting-web-app/blob/a4ae6c9/src/providers/Server.ts#L17)*

## Methods

### \_mountMiddlewares

▸ `Private`**_mountMiddlewares**(): void

*Defined in [src/providers/Server.ts:29](https://github.com/BESTUPC/voting-web-app/blob/a4ae6c9/src/providers/Server.ts#L29)*

mountMiddlewares

**Returns:** void

___

### \_mountRoutes

▸ `Private`**_mountRoutes**(): void

*Defined in [src/providers/Server.ts:60](https://github.com/BESTUPC/voting-web-app/blob/a4ae6c9/src/providers/Server.ts#L60)*

mountRoutes

**Returns:** void

___

### configure

▸ **configure**(): void

*Defined in [src/providers/Server.ts:98](https://github.com/BESTUPC/voting-web-app/blob/a4ae6c9/src/providers/Server.ts#L98)*

**Returns:** void

___

### getServer

▸ **getServer**(): Express

*Defined in [src/providers/Server.ts:94](https://github.com/BESTUPC/voting-web-app/blob/a4ae6c9/src/providers/Server.ts#L94)*

**Returns:** Express

___

### listen

▸ **listen**(): void

*Defined in [src/providers/Server.ts:106](https://github.com/BESTUPC/voting-web-app/blob/a4ae6c9/src/providers/Server.ts#L106)*

listen

**Returns:** void

___

### \_getCertificates

▸ `Static` `Private`**_getCertificates**(): [ICertificates](../interfaces/_interface_icertificates_.icertificates.md) \| null

*Defined in [src/providers/Server.ts:68](https://github.com/BESTUPC/voting-web-app/blob/a4ae6c9/src/providers/Server.ts#L68)*

getCertificates

**Returns:** [ICertificates](../interfaces/_interface_icertificates_.icertificates.md) \| null
