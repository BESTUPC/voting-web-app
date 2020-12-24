**[webapp](../README.md)**

> [Globals](../globals.md) / ["models/UserModel"](../modules/_models_usermodel_.md) / UserModel

# Class: UserModel

## Hierarchy

* **UserModel**

## Index

### Methods

* [add](_models_usermodel_.usermodel.md#add)
* [get](_models_usermodel_.usermodel.md#get)
* [getAll](_models_usermodel_.usermodel.md#getall)
* [getCollection](_models_usermodel_.usermodel.md#getcollection)
* [updateMembership](_models_usermodel_.usermodel.md#updatemembership)

## Methods

### add

▸ `Static`**add**(`user`: [IUser](../interfaces/_interface_iuser_.iuser.md)): Promise<boolean\>

*Defined in [src/models/UserModel.ts:30](https://github.com/BESTUPC/voting-web-app/blob/08738de/src/models/UserModel.ts#L30)*

#### Parameters:

Name | Type |
------ | ------ |
`user` | [IUser](../interfaces/_interface_iuser_.iuser.md) |

**Returns:** Promise<boolean\>

___

### get

▸ `Static`**get**(`userId`: string): Promise<[IUser](../interfaces/_interface_iuser_.iuser.md) \| null\>

*Defined in [src/models/UserModel.ts:9](https://github.com/BESTUPC/voting-web-app/blob/08738de/src/models/UserModel.ts#L9)*

#### Parameters:

Name | Type |
------ | ------ |
`userId` | string |

**Returns:** Promise<[IUser](../interfaces/_interface_iuser_.iuser.md) \| null\>

___

### getAll

▸ `Static`**getAll**(): Promise<Array<[IUser](../interfaces/_interface_iuser_.iuser.md)\>\>

*Defined in [src/models/UserModel.ts:13](https://github.com/BESTUPC/voting-web-app/blob/08738de/src/models/UserModel.ts#L13)*

**Returns:** Promise<Array<[IUser](../interfaces/_interface_iuser_.iuser.md)\>\>

___

### getCollection

▸ `Static` `Private`**getCollection**(): Collection

*Defined in [src/models/UserModel.ts:6](https://github.com/BESTUPC/voting-web-app/blob/08738de/src/models/UserModel.ts#L6)*

**Returns:** Collection

___

### updateMembership

▸ `Static`**updateMembership**(`userId`: string, `membership`: Array<[IMembership](../modules/_interface_iuser_.md#imembership)\>): Promise<boolean\>

*Defined in [src/models/UserModel.ts:17](https://github.com/BESTUPC/voting-web-app/blob/08738de/src/models/UserModel.ts#L17)*

#### Parameters:

Name | Type |
------ | ------ |
`userId` | string |
`membership` | Array<[IMembership](../modules/_interface_iuser_.md#imembership)\> |

**Returns:** Promise<boolean\>
