**[webapp](../README.md)**

> [Globals](../globals.md) / ["routers/MasterRouter"](../modules/_routers_masterrouter_.md) / MasterRouter

# Class: MasterRouter

## Hierarchy

* **MasterRouter**

## Index

### Constructors

* [constructor](_routers_masterrouter_.masterrouter.md#constructor)

### Properties

* [\_pollRouter](_routers_masterrouter_.masterrouter.md#_pollrouter)
* [\_router](_routers_masterrouter_.masterrouter.md#_router)
* [\_userRouter](_routers_masterrouter_.masterrouter.md#_userrouter)

### Accessors

* [router](_routers_masterrouter_.masterrouter.md#router)

### Methods

* [\_configure](_routers_masterrouter_.masterrouter.md#_configure)

## Constructors

### constructor

\+ **new MasterRouter**(): [MasterRouter](_routers_masterrouter_.masterrouter.md)

*Defined in [src/routers/MasterRouter.ts:12](https://github.com/BESTUPC/voting-web-app/blob/a4ae6c9/src/routers/MasterRouter.ts#L12)*

**Returns:** [MasterRouter](_routers_masterrouter_.masterrouter.md)

## Properties

### \_pollRouter

• `Private` **\_pollRouter**: [PollRouter](_routers_pollrouter_.pollrouter.md)

*Defined in [src/routers/MasterRouter.ts:8](https://github.com/BESTUPC/voting-web-app/blob/a4ae6c9/src/routers/MasterRouter.ts#L8)*

___

### \_router

• `Private` **\_router**: Router = Router()

*Defined in [src/routers/MasterRouter.ts:6](https://github.com/BESTUPC/voting-web-app/blob/a4ae6c9/src/routers/MasterRouter.ts#L6)*

___

### \_userRouter

• `Private` **\_userRouter**: UserRouter

*Defined in [src/routers/MasterRouter.ts:7](https://github.com/BESTUPC/voting-web-app/blob/a4ae6c9/src/routers/MasterRouter.ts#L7)*

## Accessors

### router

• get **router**(): Router

*Defined in [src/routers/MasterRouter.ts:10](https://github.com/BESTUPC/voting-web-app/blob/a4ae6c9/src/routers/MasterRouter.ts#L10)*

**Returns:** Router

## Methods

### \_configure

▸ `Private`**_configure**(): void

*Defined in [src/routers/MasterRouter.ts:23](https://github.com/BESTUPC/voting-web-app/blob/a4ae6c9/src/routers/MasterRouter.ts#L23)*

Connect routes to their matching routers.

**Returns:** void
