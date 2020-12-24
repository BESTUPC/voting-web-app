**[webapp](../README.md)**

> [Globals](../globals.md) / ["controllers/PollController"](../modules/_controllers_pollcontroller_.md) / PollController

# Class: PollController

Controller for the poll-related calls. It handles all the logic between routing and the database access.

## Hierarchy

* **PollController**

## Index

### Methods

* [addPoll](_controllers_pollcontroller_.pollcontroller.md#addpoll)
* [deletePoll](_controllers_pollcontroller_.pollcontroller.md#deletepoll)
* [getPoll](_controllers_pollcontroller_.pollcontroller.md#getpoll)
* [getPolls](_controllers_pollcontroller_.pollcontroller.md#getpolls)
* [updateState](_controllers_pollcontroller_.pollcontroller.md#updatestate)

## Methods

### addPoll

▸ `Static`**addPoll**(`userId`: string, `body`: unknown): Promise<boolean\>

*Defined in [src/controllers/PollController.ts:69](https://github.com/BESTUPC/voting-web-app/blob/443129a/src/controllers/PollController.ts#L69)*

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`userId` | string | id of the user making the request. |
`body` | unknown | poll to add. |

**Returns:** Promise<boolean\>

Promise<boolean>

___

### deletePoll

▸ `Static`**deletePoll**(`userId`: string, `_id`: string): Promise<boolean\>

*Defined in [src/controllers/PollController.ts:87](https://github.com/BESTUPC/voting-web-app/blob/443129a/src/controllers/PollController.ts#L87)*

#### Parameters:

Name | Type |
------ | ------ |
`userId` | string |
`_id` | string |

**Returns:** Promise<boolean\>

___

### getPoll

▸ `Static`**getPoll**(`userId`: string, `_id`: string): Promise<[IPoll](../interfaces/_interface_ipoll_.ipoll.md)\>

*Defined in [src/controllers/PollController.ts:28](https://github.com/BESTUPC/voting-web-app/blob/443129a/src/controllers/PollController.ts#L28)*

If the user has the proper membership, it returns the poll with the id provided.

**`throws`** Error 401 if the user is not authorized to get that poll.

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`userId` | string | id of the user making the request. |
`_id` | string | id of the poll. |

**Returns:** Promise<[IPoll](../interfaces/_interface_ipoll_.ipoll.md)\>

Promise<[IPoll](../interfaces/_interface_ipoll_.ipoll.md)>>

___

### getPolls

▸ `Static`**getPolls**(`userId`: string): Promise<Array<[IPoll](../interfaces/_interface_ipoll_.ipoll.md)\>\>

*Defined in [src/controllers/PollController.ts:16](https://github.com/BESTUPC/voting-web-app/blob/443129a/src/controllers/PollController.ts#L16)*

Returns the polls that the user's membership has permission to visualize.

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`userId` | string | id of the user making the request. |

**Returns:** Promise<Array<[IPoll](../interfaces/_interface_ipoll_.ipoll.md)\>\>

the polls

___

### updateState

▸ `Static`**updateState**(`userId`: string, `_id`: string, `body`: unknown): Promise<boolean\>

*Defined in [src/controllers/PollController.ts:47](https://github.com/BESTUPC/voting-web-app/blob/443129a/src/controllers/PollController.ts#L47)*

If the user is admin it updates the poll's state to the given new state.

**`throws`** Error 400 if the body is not a valid state or missing.

**`throws`** Error 401 if the user is not admin.

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`userId` | string | id of the user making the request. |
`_id` | string | id of the poll. |
`body` | unknown | new state to set. |

**Returns:** Promise<boolean\>

Promise<boolean>
