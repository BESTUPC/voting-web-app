**[webapp](../README.md)**

> [Globals](../globals.md) / [models](../modules/models.md) / UserModel

# Class: UserModel

## Hierarchy

* **UserModel**

## Index

### Methods

* [add](models.usermodel.md#add)
* [get](models.usermodel.md#get)
* [getAll](models.usermodel.md#getall)
* [getCollection](models.usermodel.md#getcollection)
* [updateMembership](models.usermodel.md#updatemembership)

## Methods

### add

▸ `Static`**add**(`user`: [IUser](../interfaces/interface.iuser.md)): Promise<boolean\>

*Defined in [src/models/UserModel.ts:30](https://github.com/BESTUPC/voting-web-app/blob/67fed0c/src/models/UserModel.ts#L30)*

#### Parameters:

Name | Type |
------ | ------ |
`user` | [IUser](../interfaces/interface.iuser.md) |

**Returns:** Promise<boolean\>

___

### get

▸ `Static`**get**(`userId`: string): Promise<[IUser](../interfaces/interface.iuser.md) \| null\>

*Defined in [src/models/UserModel.ts:9](https://github.com/BESTUPC/voting-web-app/blob/67fed0c/src/models/UserModel.ts#L9)*

#### Parameters:

Name | Type |
------ | ------ |
`userId` | string |

**Returns:** Promise<[IUser](../interfaces/interface.iuser.md) \| null\>

___

### getAll

▸ `Static`**getAll**(): Promise<Array<[IUser](../interfaces/interface.iuser.md)\>\>

*Defined in [src/models/UserModel.ts:13](https://github.com/BESTUPC/voting-web-app/blob/67fed0c/src/models/UserModel.ts#L13)*

**Returns:** Promise<Array<[IUser](../interfaces/interface.iuser.md)\>\>

___

### getCollection

▸ `Static` `Private`**getCollection**(): Collection

*Defined in [src/models/UserModel.ts:6](https://github.com/BESTUPC/voting-web-app/blob/67fed0c/src/models/UserModel.ts#L6)*

**Returns:** Collection

___

### updateMembership

▸ `Static`**updateMembership**(`userId`: string, `membership`: Array<[IMembership](../modules/interface.md#imembership)\>): Promise<boolean\>

*Defined in [src/models/UserModel.ts:17](https://github.com/BESTUPC/voting-web-app/blob/67fed0c/src/models/UserModel.ts#L17)*

#### Parameters:

Name | Type |
------ | ------ |
`userId` | string |
`membership` | Array<[IMembership](../modules/interface.md#imembership)\> |

**Returns:** Promise<boolean\>
