**[webapp](../README.md)**

> [Globals](../globals.md) / ["routers/PollRouter"](../modules/_routers_pollrouter_.md) / PollRouter

# Class: PollRouter

## Hierarchy

* **PollRouter**

## Index

### Constructors

* [constructor](_routers_pollrouter_.pollrouter.md#constructor)

### Properties

* [\_controller](_routers_pollrouter_.pollrouter.md#_controller)
* [\_router](_routers_pollrouter_.pollrouter.md#_router)

### Accessors

* [router](_routers_pollrouter_.pollrouter.md#router)

### Methods

* [\_configure](_routers_pollrouter_.pollrouter.md#_configure)

## Constructors

### constructor

\+ **new PollRouter**(): [PollRouter](_routers_pollrouter_.pollrouter.md)

*Defined in [src/routers/PollRouter.ts:11](https://github.com/BESTUPC/voting-web-app/blob/a4ae6c9/src/routers/PollRouter.ts#L11)*

**Returns:** [PollRouter](_routers_pollrouter_.pollrouter.md)

## Properties

### \_controller

• `Private` **\_controller**: [PollController](_controllers_pollcontroller_.pollcontroller.md) = PollController

*Defined in [src/routers/PollRouter.ts:7](https://github.com/BESTUPC/voting-web-app/blob/a4ae6c9/src/routers/PollRouter.ts#L7)*

___

### \_router

• `Private` **\_router**: Router = Router()

*Defined in [src/routers/PollRouter.ts:6](https://github.com/BESTUPC/voting-web-app/blob/a4ae6c9/src/routers/PollRouter.ts#L6)*

## Accessors

### router

• get **router**(): Router

*Defined in [src/routers/PollRouter.ts:9](https://github.com/BESTUPC/voting-web-app/blob/a4ae6c9/src/routers/PollRouter.ts#L9)*

**Returns:** Router

## Methods

### \_configure

▸ `Private`**_configure**(): void

*Defined in [src/routers/PollRouter.ts:20](https://github.com/BESTUPC/voting-web-app/blob/a4ae6c9/src/routers/PollRouter.ts#L20)*

Connect routes to their matching controller endpoints.

**Returns:** void
