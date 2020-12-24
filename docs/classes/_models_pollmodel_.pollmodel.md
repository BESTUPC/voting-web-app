**[webapp](../README.md)**

> [Globals](../globals.md) / ["models/PollModel"](../modules/_models_pollmodel_.md) / PollModel

# Class: PollModel

## Hierarchy

* **PollModel**

## Index

### Methods

* [add](_models_pollmodel_.pollmodel.md#add)
* [delete](_models_pollmodel_.pollmodel.md#delete)
* [get](_models_pollmodel_.pollmodel.md#get)
* [getAll](_models_pollmodel_.pollmodel.md#getall)
* [getCollection](_models_pollmodel_.pollmodel.md#getcollection)
* [setState](_models_pollmodel_.pollmodel.md#setstate)

## Methods

### add

▸ `Static`**add**(`poll`: [IPoll](../interfaces/_interface_ipoll_.ipoll.md)): Promise<boolean\>

*Defined in [src/models/PollModel.ts:23](https://github.com/BESTUPC/voting-web-app/blob/a4ae6c9/src/models/PollModel.ts#L23)*

#### Parameters:

Name | Type |
------ | ------ |
`poll` | [IPoll](../interfaces/_interface_ipoll_.ipoll.md) |

**Returns:** Promise<boolean\>

___

### delete

▸ `Static`**delete**(`_id`: ObjectId): Promise<boolean\>

*Defined in [src/models/PollModel.ts:45](https://github.com/BESTUPC/voting-web-app/blob/a4ae6c9/src/models/PollModel.ts#L45)*

#### Parameters:

Name | Type |
------ | ------ |
`_id` | ObjectId |

**Returns:** Promise<boolean\>

___

### get

▸ `Static`**get**(`_id`: ObjectId): Promise<[IPoll](../interfaces/_interface_ipoll_.ipoll.md) \| null\>

*Defined in [src/models/PollModel.ts:19](https://github.com/BESTUPC/voting-web-app/blob/a4ae6c9/src/models/PollModel.ts#L19)*

#### Parameters:

Name | Type |
------ | ------ |
`_id` | ObjectId |

**Returns:** Promise<[IPoll](../interfaces/_interface_ipoll_.ipoll.md) \| null\>

___

### getAll

▸ `Static`**getAll**(`membership`: Array<[IMembership](../modules/_interface_iuser_.md#imembership)\>): Promise<Array<[IPoll](../interfaces/_interface_ipoll_.ipoll.md)\>\>

*Defined in [src/models/PollModel.ts:11](https://github.com/BESTUPC/voting-web-app/blob/a4ae6c9/src/models/PollModel.ts#L11)*

#### Parameters:

Name | Type |
------ | ------ |
`membership` | Array<[IMembership](../modules/_interface_iuser_.md#imembership)\> |

**Returns:** Promise<Array<[IPoll](../interfaces/_interface_ipoll_.ipoll.md)\>\>

___

### getCollection

▸ `Static` `Private`**getCollection**(): Collection

*Defined in [src/models/PollModel.ts:7](https://github.com/BESTUPC/voting-web-app/blob/a4ae6c9/src/models/PollModel.ts#L7)*

**Returns:** Collection

___

### setState

▸ `Static`**setState**(`_id`: ObjectId, `state`: [IPollState](../modules/_interface_ipoll_.md#ipollstate)): Promise<boolean\>

*Defined in [src/models/PollModel.ts:32](https://github.com/BESTUPC/voting-web-app/blob/a4ae6c9/src/models/PollModel.ts#L32)*

#### Parameters:

Name | Type |
------ | ------ |
`_id` | ObjectId |
`state` | [IPollState](../modules/_interface_ipoll_.md#ipollstate) |

**Returns:** Promise<boolean\>
