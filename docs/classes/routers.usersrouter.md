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

*Defined in [src/routers/UserRouter.ts:21](https://github.com/BESTUPC/voting-web-app/blob/3f5c425/src/routers/UserRouter.ts#L21)*

Configures the router.

**Returns:** [UsersRouter](routers.usersrouter.md)

## Properties

### \_controller

• `Private` **\_controller**: [UserController](controllers.usercontroller.md) = UserController

*Defined in [src/routers/UserRouter.ts:14](https://github.com/BESTUPC/voting-web-app/blob/3f5c425/src/routers/UserRouter.ts#L14)*

Controller to use in this router.

___

### \_router

• `Private` **\_router**: Router = Router()

*Defined in [src/routers/UserRouter.ts:9](https://github.com/BESTUPC/voting-web-app/blob/3f5c425/src/routers/UserRouter.ts#L9)*

Express router instance.

## Accessors

### router

• get **router**(): Router

*Defined in [src/routers/UserRouter.ts:19](https://github.com/BESTUPC/voting-web-app/blob/3f5c425/src/routers/UserRouter.ts#L19)*

Get function for the express router.

**Returns:** Router

## Methods

### \_configure

▸ `Private`**_configure**(): void

*Defined in [src/routers/UserRouter.ts:33](https://github.com/BESTUPC/voting-web-app/blob/3f5c425/src/routers/UserRouter.ts#L33)*

Connect routes to their matching controller endpoints.

**Returns:** void
