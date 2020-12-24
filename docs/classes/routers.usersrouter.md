**[webapp](../README.md)**

> [Globals](../globals.md) / [routers](../modules/routers.md) / UsersRouter

# Class: UsersRouter

## Hierarchy

* **UsersRouter**

## Index

### Constructors

* [constructor](routers.usersrouter.md#constructor)

### Properties

* [\_controller](routers.usersrouter.md#_controller)
* [\_router](routers.usersrouter.md#_router)

### Accessors

* [router](routers.usersrouter.md#router)

### Methods

* [\_configure](routers.usersrouter.md#_configure)

## Constructors

### constructor

\+ **new UsersRouter**(): [UsersRouter](routers.usersrouter.md)

*Defined in [src/routers/UserRouter.ts:11](https://github.com/BESTUPC/voting-web-app/blob/67fed0c/src/routers/UserRouter.ts#L11)*

**Returns:** [UsersRouter](routers.usersrouter.md)

## Properties

### \_controller

• `Private` **\_controller**: [UserController](controllers.usercontroller.md) = UserController

*Defined in [src/routers/UserRouter.ts:7](https://github.com/BESTUPC/voting-web-app/blob/67fed0c/src/routers/UserRouter.ts#L7)*

___

### \_router

• `Private` **\_router**: Router = Router()

*Defined in [src/routers/UserRouter.ts:6](https://github.com/BESTUPC/voting-web-app/blob/67fed0c/src/routers/UserRouter.ts#L6)*

## Accessors

### router

• get **router**(): Router

*Defined in [src/routers/UserRouter.ts:9](https://github.com/BESTUPC/voting-web-app/blob/67fed0c/src/routers/UserRouter.ts#L9)*

**Returns:** Router

## Methods

### \_configure

▸ `Private`**_configure**(): void

*Defined in [src/routers/UserRouter.ts:20](https://github.com/BESTUPC/voting-web-app/blob/67fed0c/src/routers/UserRouter.ts#L20)*

Connect routes to their matching controller endpoints.

**Returns:** void
