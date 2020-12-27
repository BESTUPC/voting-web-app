**[webapp](../README.md)**

> [Globals](../globals.md) / [providers](../modules/providers.md) / Server

# Class: Server

Custom server application class.

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

*Defined in [src/providers/Server.ts:19](https://github.com/BESTUPC/voting-web-app/blob/807b76c/src/providers/Server.ts#L19)*

Server class constructor.

**Returns:** [Server](providers.server.md)

## Properties

### server

• `Private` **server**: Express

*Defined in [src/providers/Server.ts:19](https://github.com/BESTUPC/voting-web-app/blob/807b76c/src/providers/Server.ts#L19)*

Express server instance to setup.

## Methods

### \_mountMiddlewares

▸ `Private`**_mountMiddlewares**(): void

*Defined in [src/providers/Server.ts:31](https://github.com/BESTUPC/voting-web-app/blob/807b76c/src/providers/Server.ts#L31)*

Mounts the body parser and custom error handler middlewares.

**Returns:** void

___

### \_mountRoutes

▸ `Private`**_mountRoutes**(): void

*Defined in [src/providers/Server.ts:61](https://github.com/BESTUPC/voting-web-app/blob/807b76c/src/providers/Server.ts#L61)*

Configures the file serving and the api route.

**Returns:** void

___

### configure

▸ **configure**(): void

*Defined in [src/providers/Server.ts:106](https://github.com/BESTUPC/voting-web-app/blob/807b76c/src/providers/Server.ts#L106)*

Call the mount functions.

**Returns:** void

___

### getServer

▸ **getServer**(): Express

*Defined in [src/providers/Server.ts:99](https://github.com/BESTUPC/voting-web-app/blob/807b76c/src/providers/Server.ts#L99)*

Function to access the server to share it with other providers.

**Returns:** Express

___

### listen

▸ **listen**(): void

*Defined in [src/providers/Server.ts:114](https://github.com/BESTUPC/voting-web-app/blob/807b76c/src/providers/Server.ts#L114)*

Start the server. If possible it will run both a HTTP and HTTPS port.

**Returns:** void

___

### \_getCertificates

▸ `Static` `Private`**_getCertificates**(): [ICertificates](../interfaces/interfaces.icertificates.md) \| null

*Defined in [src/providers/Server.ts:70](https://github.com/BESTUPC/voting-web-app/blob/807b76c/src/providers/Server.ts#L70)*

Gets the SSL certificates.

**Returns:** [ICertificates](../interfaces/interfaces.icertificates.md) \| null

the SSL certificates if found or null otherwise.
