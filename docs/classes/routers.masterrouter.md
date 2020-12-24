**[webapp](../README.md)**

> [Globals](../globals.md) / [routers](../modules/routers.md) / MasterRouter

# Class: MasterRouter

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

*Defined in [src/routers/MasterRouter.ts:12](https://github.com/BESTUPC/voting-web-app/blob/67fed0c/src/routers/MasterRouter.ts#L12)*

**Returns:** [MasterRouter](routers.masterrouter.md)

## Properties

### \_pollRouter

• `Private` **\_pollRouter**: [PollRouter](routers.pollrouter.md)

*Defined in [src/routers/MasterRouter.ts:8](https://github.com/BESTUPC/voting-web-app/blob/67fed0c/src/routers/MasterRouter.ts#L8)*

___

### \_router

• `Private` **\_router**: Router = Router()

*Defined in [src/routers/MasterRouter.ts:6](https://github.com/BESTUPC/voting-web-app/blob/67fed0c/src/routers/MasterRouter.ts#L6)*

___

### \_userRouter

• `Private` **\_userRouter**: UserRouter

*Defined in [src/routers/MasterRouter.ts:7](https://github.com/BESTUPC/voting-web-app/blob/67fed0c/src/routers/MasterRouter.ts#L7)*

## Accessors

### router

• get **router**(): Router

*Defined in [src/routers/MasterRouter.ts:10](https://github.com/BESTUPC/voting-web-app/blob/67fed0c/src/routers/MasterRouter.ts#L10)*

**Returns:** Router

## Methods

### \_configure

▸ `Private`**_configure**(): void

*Defined in [src/routers/MasterRouter.ts:23](https://github.com/BESTUPC/voting-web-app/blob/67fed0c/src/routers/MasterRouter.ts#L23)*

Connect routes to their matching routers.

**Returns:** void
