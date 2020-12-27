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

*Defined in [src/routers/PollRouter.ts:21](https://github.com/BESTUPC/voting-web-app/blob/807b76c/src/routers/PollRouter.ts#L21)*

**Returns:** [PollRouter](routers.pollrouter.md)

## Properties

### \_controller

• `Private` **\_controller**: [PollController](controllers.pollcontroller.md) = PollController

*Defined in [src/routers/PollRouter.ts:14](https://github.com/BESTUPC/voting-web-app/blob/807b76c/src/routers/PollRouter.ts#L14)*

Controller to use in this router.

___

### \_router

• `Private` **\_router**: Router = Router()

*Defined in [src/routers/PollRouter.ts:9](https://github.com/BESTUPC/voting-web-app/blob/807b76c/src/routers/PollRouter.ts#L9)*

Express router instance.

## Accessors

### router

• get **router**(): Router

*Defined in [src/routers/PollRouter.ts:19](https://github.com/BESTUPC/voting-web-app/blob/807b76c/src/routers/PollRouter.ts#L19)*

Get function for the express router.

**Returns:** Router

## Methods

### \_configure

▸ `Private`**_configure**(): void

*Defined in [src/routers/PollRouter.ts:30](https://github.com/BESTUPC/voting-web-app/blob/807b76c/src/routers/PollRouter.ts#L30)*

Connect routes to their matching controller endpoints.

**Returns:** void
