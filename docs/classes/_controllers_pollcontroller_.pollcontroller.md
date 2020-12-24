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

*Defined in [src/controllers/PollController.ts:72](https://github.com/BESTUPC/voting-web-app/blob/a4ae6c9/src/controllers/PollController.ts#L72)*

If the user is admin it adds the given poll to the database.

**`throws`** Error 400 if the body is not a valid state or missing.

**`throws`** Error 401 if the user is not admin.

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`userId` | string | id of the user making the request. |
`body` | unknown | poll to add. |

**Returns:** Promise<boolean\>

true if the poll could be added or false if otherwise and no errors arised.

___

### deletePoll

▸ `Static`**deletePoll**(`userId`: string, `_id`: string): Promise<boolean\>

*Defined in [src/controllers/PollController.ts:93](https://github.com/BESTUPC/voting-web-app/blob/a4ae6c9/src/controllers/PollController.ts#L93)*

If the user is admin it adds deletes the given poll from the database.

**`throws`** Error 400 if the body is not a valid state or missing.

**`throws`** Error 401 if the user is not admin.

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`userId` | string | id of the user making the request. |
`_id` | string | id of the poll to delete. |

**Returns:** Promise<boolean\>

true if the poll could be deleted or false if otherwise and no errors arised.

___

### getPoll

▸ `Static`**getPoll**(`userId`: string, `_id`: string): Promise<[IPoll](../interfaces/_interface_ipoll_.ipoll.md)\>

*Defined in [src/controllers/PollController.ts:29](https://github.com/BESTUPC/voting-web-app/blob/a4ae6c9/src/controllers/PollController.ts#L29)*

If the user has the proper membership, it returns the poll with the id provided.

**`throws`** Error 401 if the user is not authorized to get that poll.

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`userId` | string | id of the user making the request. |
`_id` | string | id of the poll. |

**Returns:** Promise<[IPoll](../interfaces/_interface_ipoll_.ipoll.md)\>

the poll requested.

___

### getPolls

▸ `Static`**getPolls**(`userId`: string): Promise<Array<[IPoll](../interfaces/_interface_ipoll_.ipoll.md)\>\>

*Defined in [src/controllers/PollController.ts:17](https://github.com/BESTUPC/voting-web-app/blob/a4ae6c9/src/controllers/PollController.ts#L17)*

Returns the polls that the user's membership has permission to visualize.

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`userId` | string | id of the user making the request. |

**Returns:** Promise<Array<[IPoll](../interfaces/_interface_ipoll_.ipoll.md)\>\>

an array with the polls that the user can access.

___

### updateState

▸ `Static`**updateState**(`userId`: string, `_id`: string, `body`: unknown): Promise<boolean\>

*Defined in [src/controllers/PollController.ts:48](https://github.com/BESTUPC/voting-web-app/blob/a4ae6c9/src/controllers/PollController.ts#L48)*

If the user is admin it updates the poll's state to the given new state.

**`throws`** Error 400 if the body is not a valid state or missing.

**`throws`** Error 401 if the user is not admin.

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`userId` | string | id of the user making the request. |
`_id` | string | id of the poll. |
`body` | unknown | new state to set. It should be a valid [IPollState](../modules/_interface_ipoll_.md#ipollstate). |

**Returns:** Promise<boolean\>

true if the state could be set or false if otherwise and no errors arised.
