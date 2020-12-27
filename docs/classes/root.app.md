**[webapp](../README.md)**

> [Globals](../globals.md) / [root](../modules/root.md) / App

# Class: App

Final application class

## Hierarchy

* **App**

## Index

### Constructors

* [constructor](root.app.md#constructor)

### Properties

* [server](root.app.md#server)

### Methods

* [start](root.app.md#start)

## Constructors

### constructor

\+ **new App**(): [App](root.app.md)

*Defined in [src/app.ts:18](https://github.com/BESTUPC/voting-web-app/blob/807b76c/src/app.ts#L18)*

Server class constructor

**Returns:** [App](root.app.md)

## Properties

### server

• `Private` **server**: [Server](providers.server.md)

*Defined in [src/app.ts:18](https://github.com/BESTUPC/voting-web-app/blob/807b76c/src/app.ts#L18)*

Custom application instance

## Methods

### start

▸ **start**(): Promise<void\>

*Defined in [src/app.ts:29](https://github.com/BESTUPC/voting-web-app/blob/807b76c/src/app.ts#L29)*

Connect the database, configure the server and start it.

**Returns:** Promise<void\>
