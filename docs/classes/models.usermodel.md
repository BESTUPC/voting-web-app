**[webapp](../README.md)**

> [Globals](../globals.md) / [models](../modules/models.md) / UserModel

# Class: UserModel

Class for communication between controller and users database.

## Hierarchy

* **UserModel**

## Index

### Methods

* [\_getCollection](models.usermodel.md#_getcollection)
* [add](models.usermodel.md#add)
* [get](models.usermodel.md#get)
* [getAll](models.usermodel.md#getall)
* [updateMembership](models.usermodel.md#updatemembership)

## Methods

### \_getCollection

▸ `Static` `Private`**_getCollection**(): Collection

*Defined in [src/models/UserModel.ts:12](https://github.com/BESTUPC/voting-web-app/blob/3f5c425/src/models/UserModel.ts#L12)*

Auxiliary function to get the right collection.

**Returns:** Collection

___

### add

▸ `Static`**add**(`user`: [IUser](../interfaces/interfaces.iuser.md)): Promise<boolean\>

*Defined in [src/models/UserModel.ts:57](https://github.com/BESTUPC/voting-web-app/blob/3f5c425/src/models/UserModel.ts#L57)*

Add the user.

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`user` | [IUser](../interfaces/interfaces.iuser.md) | user object to add. |

**Returns:** Promise<boolean\>

Returns true if added, false otherwise.

___

### get

▸ `Static`**get**(`userId`: string): Promise<[IUser](../interfaces/interfaces.iuser.md) \| null\>

*Defined in [src/models/UserModel.ts:21](https://github.com/BESTUPC/voting-web-app/blob/3f5c425/src/models/UserModel.ts#L21)*

Get the user.

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`userId` | string | googleId of the user to get. |

**Returns:** Promise<[IUser](../interfaces/interfaces.iuser.md) \| null\>

Returns the requested user or null if not found.

___

### getAll

▸ `Static`**getAll**(): Promise<Array<[IUser](../interfaces/interfaces.iuser.md)\>\>

*Defined in [src/models/UserModel.ts:29](https://github.com/BESTUPC/voting-web-app/blob/3f5c425/src/models/UserModel.ts#L29)*

Gets all the users.

**Returns:** Promise<Array<[IUser](../interfaces/interfaces.iuser.md)\>\>

Returns an array of users.

___

### updateMembership

▸ `Static`**updateMembership**(`userId`: string, `membership`: Array<[IMembership](../modules/interfaces.md#imembership)\>): Promise<boolean\>

*Defined in [src/models/UserModel.ts:39](https://github.com/BESTUPC/voting-web-app/blob/3f5c425/src/models/UserModel.ts#L39)*

Change the user membership.

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`userId` | string | id of the user to modify. |
`membership` | Array<[IMembership](../modules/interfaces.md#imembership)\> | array of memberships to set to the user. |

**Returns:** Promise<boolean\>

Returns true if updated, false otherwise.
