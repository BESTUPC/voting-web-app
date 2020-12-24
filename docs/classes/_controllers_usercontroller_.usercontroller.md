**[webapp](../README.md)**

> [Globals](../globals.md) / ["controllers/UserController"](../modules/_controllers_usercontroller_.md) / UserController

# Class: UserController

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

*Defined in [src/controllers/UserController.ts:23](https://github.com/BESTUPC/voting-web-app/blob/443129a/src/controllers/UserController.ts#L23)*

#### Parameters:

Name | Type |
------ | ------ |
`body` | { displayName: string ; emails?: Array<{ type?: string ; value: string  }\> ; id: string  } |

**Returns:** Promise<boolean\>

___

### getUser

▸ `Static`**getUser**(`userId`: string): Promise<[IUser](../interfaces/_interface_iuser_.iuser.md)\>

*Defined in [src/controllers/UserController.ts:45](https://github.com/BESTUPC/voting-web-app/blob/443129a/src/controllers/UserController.ts#L45)*

#### Parameters:

Name | Type |
------ | ------ |
`userId` | string |

**Returns:** Promise<[IUser](../interfaces/_interface_iuser_.iuser.md)\>

___

### getUsers

▸ `Static`**getUsers**(`userId`: string): Promise<Array<[IUser](../interfaces/_interface_iuser_.iuser.md)\>\>

*Defined in [src/controllers/UserController.ts:37](https://github.com/BESTUPC/voting-web-app/blob/443129a/src/controllers/UserController.ts#L37)*

#### Parameters:

Name | Type |
------ | ------ |
`userId` | string |

**Returns:** Promise<Array<[IUser](../interfaces/_interface_iuser_.iuser.md)\>\>

___

### isAdmin

▸ `Static`**isAdmin**(`userId`: string): Promise<boolean\>

*Defined in [src/controllers/UserController.ts:49](https://github.com/BESTUPC/voting-web-app/blob/443129a/src/controllers/UserController.ts#L49)*

#### Parameters:

Name | Type |
------ | ------ |
`userId` | string |

**Returns:** Promise<boolean\>

___

### updateMembership

▸ `Static`**updateMembership**(`userId1`: string, `userId2`: string, `body`: unknown): Promise<boolean\>

*Defined in [src/controllers/UserController.ts:6](https://github.com/BESTUPC/voting-web-app/blob/443129a/src/controllers/UserController.ts#L6)*

#### Parameters:

Name | Type |
------ | ------ |
`userId1` | string |
`userId2` | string |
`body` | unknown |

**Returns:** Promise<boolean\>