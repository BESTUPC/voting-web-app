**[webapp](../README.md)**

> [Globals](../globals.md) / [models](../modules/models.md) / PollModel

# Class: PollModel

Class for communication between controller and polls database.

## Hierarchy

* **PollModel**

## Index

### Methods

* [\_getCollection](models.pollmodel.md#_getcollection)
* [add](models.pollmodel.md#add)
* [delete](models.pollmodel.md#delete)
* [get](models.pollmodel.md#get)
* [getAll](models.pollmodel.md#getall)
* [setState](models.pollmodel.md#setstate)

## Methods

### \_getCollection

▸ `Static` `Private`**_getCollection**(): Collection

*Defined in [src/models/PollModel.ts:13](https://github.com/BESTUPC/voting-web-app/blob/3f5c425/src/models/PollModel.ts#L13)*

Auxiliary function to get the right collection.

**Returns:** Collection

___

### add

▸ `Static`**add**(`poll`: [IPoll](../interfaces/interfaces.ipoll.md)): Promise<boolean\>

*Defined in [src/models/PollModel.ts:44](https://github.com/BESTUPC/voting-web-app/blob/3f5c425/src/models/PollModel.ts#L44)*

Add the poll.

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`poll` | [IPoll](../interfaces/interfaces.ipoll.md) | poll object to add. |

**Returns:** Promise<boolean\>

Returns true if added, false otherwise.

___

### delete

▸ `Static`**delete**(`_id`: ObjectId): Promise<boolean\>

*Defined in [src/models/PollModel.ts:77](https://github.com/BESTUPC/voting-web-app/blob/3f5c425/src/models/PollModel.ts#L77)*

Delete the poll.

#### Parameters:

Name | Type |
------ | ------ |
`_id` | ObjectId |

**Returns:** Promise<boolean\>

Returns true if deleted, false otherwise.

___

### get

▸ `Static`**get**(`_id`: ObjectId): Promise<[IPoll](../interfaces/interfaces.ipoll.md) \| null\>

*Defined in [src/models/PollModel.ts:35](https://github.com/BESTUPC/voting-web-app/blob/3f5c425/src/models/PollModel.ts#L35)*

Get the poll.

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`_id` | ObjectId | id of the poll to obtain. |

**Returns:** Promise<[IPoll](../interfaces/interfaces.ipoll.md) \| null\>

Returns the requested poll or null if not found.

___

### getAll

▸ `Static`**getAll**(`membership`: Array<[IMembership](../modules/interfaces.md#imembership)\>): Promise<Array<[IPoll](../interfaces/interfaces.ipoll.md)\>\>

*Defined in [src/models/PollModel.ts:22](https://github.com/BESTUPC/voting-web-app/blob/3f5c425/src/models/PollModel.ts#L22)*

Gets all the polls that contain the given membership.

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`membership` | Array<[IMembership](../modules/interfaces.md#imembership)\> | membership to filter the polls with. |

**Returns:** Promise<Array<[IPoll](../interfaces/interfaces.ipoll.md)\>\>

Returns an array of polls.

___

### setState

▸ `Static`**setState**(`_id`: ObjectId, `state`: [IPollState](../modules/interfaces.md#ipollstate)): Promise<boolean\>

*Defined in [src/models/PollModel.ts:59](https://github.com/BESTUPC/voting-web-app/blob/3f5c425/src/models/PollModel.ts#L59)*

Change the poll state.

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`_id` | ObjectId | id of the poll to modify. |
`state` | [IPollState](../modules/interfaces.md#ipollstate) | state to set the poll to. |

**Returns:** Promise<boolean\>

Returns true if updated, false otherwise.
