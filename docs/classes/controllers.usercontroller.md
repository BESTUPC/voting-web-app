**[webapp](../README.md)**

> [Globals](../globals.md) / [controllers](../modules/controllers.md) / UserController

# Class: UserController

Controller for the user-related calls. It handles all the logic between routing and the database access.

## Hierarchy

* **UserController**

## Index

### Methods

* [addUser](controllers.usercontroller.md#adduser)
* [getUser](controllers.usercontroller.md#getuser)
* [getUsers](controllers.usercontroller.md#getusers)
* [isAdmin](controllers.usercontroller.md#isadmin)
* [updateMembership](controllers.usercontroller.md#updatemembership)

## Methods

### addUser

▸ `Static`**addUser**(`body`: unknown): Promise<boolean\>

*Defined in [src/controllers/UserController.ts:44](https://github.com/BESTUPC/voting-web-app/blob/3f5c425/src/controllers/UserController.ts#L44)*

Tries to add the user to the database.

**`throws`** Error 400 if the body is not a valid user.

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`body` | unknown | user to add, should be castable to [IGoogleUser](../interfaces/interfaces.igoogleuser.md). |

**Returns:** Promise<boolean\>

true if the user could be added or false if otherwise and no errors arised.

___

### getUser

▸ `Static`**getUser**(`userId1`: string, `userId2`: string): Promise<[IUser](../interfaces/interfaces.iuser.md)\>

*Defined in [src/controllers/UserController.ts:78](https://github.com/BESTUPC/voting-web-app/blob/3f5c425/src/controllers/UserController.ts#L78)*

Returns the user requested.

**`throws`** Error 401 if the user is not admin or the ids are not the same.

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`userId1` | string | id of the user making the request. |
`userId2` | string | id of the user requested. |

**Returns:** Promise<[IUser](../interfaces/interfaces.iuser.md)\>

Returns the user as [IUser](../interfaces/interfaces.iuser.md).

___

### getUsers

▸ `Static`**getUsers**(`userId`: string): Promise<Array<[IUser](../interfaces/interfaces.iuser.md)\>\>

*Defined in [src/controllers/UserController.ts:63](https://github.com/BESTUPC/voting-web-app/blob/3f5c425/src/controllers/UserController.ts#L63)*

Returns the users if the requester is admin.

**`throws`** Error 401 if the user is not admin.

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`userId` | string | id of the user making the request. |

**Returns:** Promise<Array<[IUser](../interfaces/interfaces.iuser.md)\>\>

Returns an array with the users as [IUser](../interfaces/interfaces.iuser.md).

___

### isAdmin

▸ `Static`**isAdmin**(`userId`: string): Promise<boolean\>

*Defined in [src/controllers/UserController.ts:97](https://github.com/BESTUPC/voting-web-app/blob/3f5c425/src/controllers/UserController.ts#L97)*

Returns true if the user is admin, false otherwise.

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`userId` | string | id of the user. |

**Returns:** Promise<boolean\>

Returns true or false, according to the membership status of the user.

___

### updateMembership

▸ `Static`**updateMembership**(`userId1`: string, `userId2`: string, `body`: unknown): Promise<boolean\>

*Defined in [src/controllers/UserController.ts:23](https://github.com/BESTUPC/voting-web-app/blob/3f5c425/src/controllers/UserController.ts#L23)*

If the user identified by userId1 is admin it updates the membership of the user identified by userId2 to the membership given.

**`throws`** Error 400 if the body is not a valid membership array or missing.

**`throws`** Error 401 if the user is not admin.

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`userId1` | string | id of the user making the request. |
`userId2` | string | id of the poll. |
`body` | unknown | new membershep to set. It should be an array of valid [IMembership](../modules/interfaces.md#imembership). |

**Returns:** Promise<boolean\>

Returns true if the membership could be set or false if otherwise and no errors arised.
