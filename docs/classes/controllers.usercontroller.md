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

▸ `Static`**addUser**(`body`: { displayName: string ; emails?: Array<{ type?: string ; value: string  }\> ; id: string  }): Promise<boolean\>

*Defined in [src/controllers/UserController.ts:25](https://github.com/BESTUPC/voting-web-app/blob/67fed0c/src/controllers/UserController.ts#L25)*

#### Parameters:

Name | Type |
------ | ------ |
`body` | { displayName: string ; emails?: Array<{ type?: string ; value: string  }\> ; id: string  } |

**Returns:** Promise<boolean\>

___

### getUser

▸ `Static`**getUser**(`userId`: string): Promise<[IUser](../interfaces/interface.iuser.md)\>

*Defined in [src/controllers/UserController.ts:47](https://github.com/BESTUPC/voting-web-app/blob/67fed0c/src/controllers/UserController.ts#L47)*

#### Parameters:

Name | Type |
------ | ------ |
`userId` | string |

**Returns:** Promise<[IUser](../interfaces/interface.iuser.md)\>

___

### getUsers

▸ `Static`**getUsers**(`userId`: string): Promise<Array<[IUser](../interfaces/interface.iuser.md)\>\>

*Defined in [src/controllers/UserController.ts:39](https://github.com/BESTUPC/voting-web-app/blob/67fed0c/src/controllers/UserController.ts#L39)*

#### Parameters:

Name | Type |
------ | ------ |
`userId` | string |

**Returns:** Promise<Array<[IUser](../interfaces/interface.iuser.md)\>\>

___

### isAdmin

▸ `Static`**isAdmin**(`userId`: string): Promise<boolean\>

*Defined in [src/controllers/UserController.ts:51](https://github.com/BESTUPC/voting-web-app/blob/67fed0c/src/controllers/UserController.ts#L51)*

#### Parameters:

Name | Type |
------ | ------ |
`userId` | string |

**Returns:** Promise<boolean\>

___

### updateMembership

▸ `Static`**updateMembership**(`userId1`: string, `userId2`: string, `body`: unknown): Promise<boolean\>

*Defined in [src/controllers/UserController.ts:9](https://github.com/BESTUPC/voting-web-app/blob/67fed0c/src/controllers/UserController.ts#L9)*

#### Parameters:

Name | Type |
------ | ------ |
`userId1` | string |
`userId2` | string |
`body` | unknown |

**Returns:** Promise<boolean\>
