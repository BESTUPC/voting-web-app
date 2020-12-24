**[webapp](../README.md)**

> [Globals](../globals.md) / ["controllers/UserController"](../modules/_controllers_usercontroller_.md) / UserController

# Class: UserController

Controller for the user-related calls. It handles all the logic between routing and the database access.

## Hierarchy

* **UserController**

## Index

### Methods

* [addUser](_controllers_usercontroller_.usercontroller.md#adduser)
* [getUser](_controllers_usercontroller_.usercontroller.md#getuser)
* [getUsers](_controllers_usercontroller_.usercontroller.md#getusers)
* [isAdmin](_controllers_usercontroller_.usercontroller.md#isadmin)
* [updateMembership](_controllers_usercontroller_.usercontroller.md#updatemembership)

## Methods

### addUser

▸ `Static`**addUser**(`body`: { displayName: string ; emails?: Array<{ type?: string ; value: string  }\> ; id: string  }): Promise<boolean\>

*Defined in [src/controllers/UserController.ts:25](https://github.com/BESTUPC/voting-web-app/blob/a4ae6c9/src/controllers/UserController.ts#L25)*

#### Parameters:

Name | Type |
------ | ------ |
`body` | { displayName: string ; emails?: Array<{ type?: string ; value: string  }\> ; id: string  } |

**Returns:** Promise<boolean\>

___

### getUser

▸ `Static`**getUser**(`userId`: string): Promise<[IUser](../interfaces/_interface_iuser_.iuser.md)\>

*Defined in [src/controllers/UserController.ts:47](https://github.com/BESTUPC/voting-web-app/blob/a4ae6c9/src/controllers/UserController.ts#L47)*

#### Parameters:

Name | Type |
------ | ------ |
`userId` | string |

**Returns:** Promise<[IUser](../interfaces/_interface_iuser_.iuser.md)\>

___

### getUsers

▸ `Static`**getUsers**(`userId`: string): Promise<Array<[IUser](../interfaces/_interface_iuser_.iuser.md)\>\>

*Defined in [src/controllers/UserController.ts:39](https://github.com/BESTUPC/voting-web-app/blob/a4ae6c9/src/controllers/UserController.ts#L39)*

#### Parameters:

Name | Type |
------ | ------ |
`userId` | string |

**Returns:** Promise<Array<[IUser](../interfaces/_interface_iuser_.iuser.md)\>\>

___

### isAdmin

▸ `Static`**isAdmin**(`userId`: string): Promise<boolean\>

*Defined in [src/controllers/UserController.ts:51](https://github.com/BESTUPC/voting-web-app/blob/a4ae6c9/src/controllers/UserController.ts#L51)*

#### Parameters:

Name | Type |
------ | ------ |
`userId` | string |

**Returns:** Promise<boolean\>

___

### updateMembership

▸ `Static`**updateMembership**(`userId1`: string, `userId2`: string, `body`: unknown): Promise<boolean\>

*Defined in [src/controllers/UserController.ts:9](https://github.com/BESTUPC/voting-web-app/blob/a4ae6c9/src/controllers/UserController.ts#L9)*

#### Parameters:

Name | Type |
------ | ------ |
`userId1` | string |
`userId2` | string |
`body` | unknown |

**Returns:** Promise<boolean\>
