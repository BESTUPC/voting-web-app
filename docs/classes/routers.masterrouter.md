**[webapp](../README.md)**

> [Globals](../globals.md) / [routers](../modules/routers.md) / MasterRouter

# Class: MasterRouter

Class to unite all the routers.

## Hierarchy

* **MasterRouter**

## Index

### Constructors

* [constructor](routers.masterrouter.md#constructor)

### Properties

* [\_pollRouter](routers.masterrouter.md#_pollrouter)
* [\_router](routers.masterrouter.md#_router)
* [\_userRouter](routers.masterrouter.md#_userrouter)

### Accessors

* [router](routers.masterrouter.md#router)

### Methods

* [\_configure](routers.masterrouter.md#_configure)

## Constructors

### constructor

\+ **new MasterRouter**(): [MasterRouter](routers.masterrouter.md)

*Defined in [src/routers/MasterRouter.ts:29](https://github.com/BESTUPC/voting-web-app/blob/3f5c425/src/routers/MasterRouter.ts#L29)*

Creates all the subrouters and configures the main one.

**Returns:** [MasterRouter](routers.masterrouter.md)

## Properties

### \_pollRouter

• `Private` **\_pollRouter**: [PollRouter](routers.pollrouter.md)

*Defined in [src/routers/MasterRouter.ts:22](https://github.com/BESTUPC/voting-web-app/blob/3f5c425/src/routers/MasterRouter.ts#L22)*

Poll router instance.

___

### \_router

• `Private` **\_router**: Router = Router()

*Defined in [src/routers/MasterRouter.ts:12](https://github.com/BESTUPC/voting-web-app/blob/3f5c425/src/routers/MasterRouter.ts#L12)*

Express router instance.

___

### \_userRouter

• `Private` **\_userRouter**: UserRouter

*Defined in [src/routers/MasterRouter.ts:17](https://github.com/BESTUPC/voting-web-app/blob/3f5c425/src/routers/MasterRouter.ts#L17)*

User router instance.

## Accessors

### router

• get **router**(): Router

*Defined in [src/routers/MasterRouter.ts:27](https://github.com/BESTUPC/voting-web-app/blob/3f5c425/src/routers/MasterRouter.ts#L27)*

Get function for the express router.

**Returns:** Router

## Methods

### \_configure

▸ `Private`**_configure**(): void

*Defined in [src/routers/MasterRouter.ts:43](https://github.com/BESTUPC/voting-web-app/blob/3f5c425/src/routers/MasterRouter.ts#L43)*

Connect routes to their matching routers.

**Returns:** void
