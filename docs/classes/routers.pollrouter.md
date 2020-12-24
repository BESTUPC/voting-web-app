**[webapp](../README.md)**

> [Globals](../globals.md) / [routers](../modules/routers.md) / PollRouter

# Class: PollRouter

## Hierarchy

* **PollRouter**

## Index

### Constructors

* [constructor](routers.pollrouter.md#constructor)

### Properties

* [\_controller](routers.pollrouter.md#_controller)
* [\_router](routers.pollrouter.md#_router)

### Accessors

* [router](routers.pollrouter.md#router)

### Methods

* [\_configure](routers.pollrouter.md#_configure)

## Constructors

### constructor

\+ **new PollRouter**(): [PollRouter](routers.pollrouter.md)

*Defined in [src/routers/PollRouter.ts:11](https://github.com/BESTUPC/voting-web-app/blob/67fed0c/src/routers/PollRouter.ts#L11)*

**Returns:** [PollRouter](routers.pollrouter.md)

## Properties

### \_controller

• `Private` **\_controller**: [PollController](controllers.pollcontroller.md) = PollController

*Defined in [src/routers/PollRouter.ts:7](https://github.com/BESTUPC/voting-web-app/blob/67fed0c/src/routers/PollRouter.ts#L7)*

___

### \_router

• `Private` **\_router**: Router = Router()

*Defined in [src/routers/PollRouter.ts:6](https://github.com/BESTUPC/voting-web-app/blob/67fed0c/src/routers/PollRouter.ts#L6)*

## Accessors

### router

• get **router**(): Router

*Defined in [src/routers/PollRouter.ts:9](https://github.com/BESTUPC/voting-web-app/blob/67fed0c/src/routers/PollRouter.ts#L9)*

**Returns:** Router

## Methods

### \_configure

▸ `Private`**_configure**(): void

*Defined in [src/routers/PollRouter.ts:20](https://github.com/BESTUPC/voting-web-app/blob/67fed0c/src/routers/PollRouter.ts#L20)*

Connect routes to their matching controller endpoints.

**Returns:** void
