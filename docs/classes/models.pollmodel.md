**[webapp](../README.md)**

> [Globals](../globals.md) / [models](../modules/models.md) / PollModel

# Class: PollModel

## Hierarchy

* **PollModel**

## Index

### Methods

* [add](models.pollmodel.md#add)
* [delete](models.pollmodel.md#delete)
* [get](models.pollmodel.md#get)
* [getAll](models.pollmodel.md#getall)
* [getCollection](models.pollmodel.md#getcollection)
* [setState](models.pollmodel.md#setstate)

## Methods

### add

▸ `Static`**add**(`poll`: [IPoll](../interfaces/interface.ipoll.md)): Promise<boolean\>

*Defined in [src/models/PollModel.ts:23](https://github.com/BESTUPC/voting-web-app/blob/67fed0c/src/models/PollModel.ts#L23)*

#### Parameters:

Name | Type |
------ | ------ |
`poll` | [IPoll](../interfaces/interface.ipoll.md) |

**Returns:** Promise<boolean\>

___

### delete

▸ `Static`**delete**(`_id`: ObjectId): Promise<boolean\>

*Defined in [src/models/PollModel.ts:45](https://github.com/BESTUPC/voting-web-app/blob/67fed0c/src/models/PollModel.ts#L45)*

#### Parameters:

Name | Type |
------ | ------ |
`_id` | ObjectId |

**Returns:** Promise<boolean\>

___

### get

▸ `Static`**get**(`_id`: ObjectId): Promise<[IPoll](../interfaces/interface.ipoll.md) \| null\>

*Defined in [src/models/PollModel.ts:19](https://github.com/BESTUPC/voting-web-app/blob/67fed0c/src/models/PollModel.ts#L19)*

#### Parameters:

Name | Type |
------ | ------ |
`_id` | ObjectId |

**Returns:** Promise<[IPoll](../interfaces/interface.ipoll.md) \| null\>

___

### getAll

▸ `Static`**getAll**(`membership`: Array<[IMembership](../modules/interface.md#imembership)\>): Promise<Array<[IPoll](../interfaces/interface.ipoll.md)\>\>

*Defined in [src/models/PollModel.ts:11](https://github.com/BESTUPC/voting-web-app/blob/67fed0c/src/models/PollModel.ts#L11)*

#### Parameters:

Name | Type |
------ | ------ |
`membership` | Array<[IMembership](../modules/interface.md#imembership)\> |

**Returns:** Promise<Array<[IPoll](../interfaces/interface.ipoll.md)\>\>

___

### getCollection

▸ `Static` `Private`**getCollection**(): Collection

*Defined in [src/models/PollModel.ts:7](https://github.com/BESTUPC/voting-web-app/blob/67fed0c/src/models/PollModel.ts#L7)*

**Returns:** Collection

___

### setState

▸ `Static`**setState**(`_id`: ObjectId, `state`: [IPollState](../modules/interface.md#ipollstate)): Promise<boolean\>

*Defined in [src/models/PollModel.ts:32](https://github.com/BESTUPC/voting-web-app/blob/67fed0c/src/models/PollModel.ts#L32)*

#### Parameters:

Name | Type |
------ | ------ |
`_id` | ObjectId |
`state` | [IPollState](../modules/interface.md#ipollstate) |

**Returns:** Promise<boolean\>
