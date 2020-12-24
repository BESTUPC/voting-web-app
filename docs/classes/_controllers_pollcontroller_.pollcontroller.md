**[webapp](../README.md)**

> [Globals](../globals.md) / ["controllers/PollController"](../modules/_controllers_pollcontroller_.md) / PollController

# Class: PollController

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

▸ `Static`**addPoll**(`userId`: string, `body`: [IPoll](../interfaces/_interface_ipoll_.ipoll.md)): Promise<boolean\>

*Defined in [src/controllers/PollController.ts:45](https://github.com/BESTUPC/voting-web-app/blob/37e241c/src/controllers/PollController.ts#L45)*

#### Parameters:

Name | Type |
------ | ------ |
`userId` | string |
`body` | [IPoll](../interfaces/_interface_ipoll_.ipoll.md) |

**Returns:** Promise<boolean\>

___

### deletePoll

▸ `Static`**deletePoll**(`userId`: string, `_id`: string): Promise<boolean\>

*Defined in [src/controllers/PollController.ts:60](https://github.com/BESTUPC/voting-web-app/blob/37e241c/src/controllers/PollController.ts#L60)*

#### Parameters:

Name | Type |
------ | ------ |
`userId` | string |
`_id` | string |

**Returns:** Promise<boolean\>

___

### getPoll

▸ `Static`**getPoll**(`userId`: string, `_id`: string): Promise<[IPoll](../interfaces/_interface_ipoll_.ipoll.md)\>

*Defined in [src/controllers/PollController.ts:14](https://github.com/BESTUPC/voting-web-app/blob/37e241c/src/controllers/PollController.ts#L14)*

#### Parameters:

Name | Type |
------ | ------ |
`userId` | string |
`_id` | string |

**Returns:** Promise<[IPoll](../interfaces/_interface_ipoll_.ipoll.md)\>

___

### getPolls

▸ `Static`**getPolls**(`userId`: string): Promise<Array<[IPoll](../interfaces/_interface_ipoll_.ipoll.md)\>\>

*Defined in [src/controllers/PollController.ts:9](https://github.com/BESTUPC/voting-web-app/blob/37e241c/src/controllers/PollController.ts#L9)*

#### Parameters:

Name | Type |
------ | ------ |
`userId` | string |

**Returns:** Promise<Array<[IPoll](../interfaces/_interface_ipoll_.ipoll.md)\>\>

___

### updateState

▸ `Static`**updateState**(`userId`: string, `_id`: string, `body`: { state: [IPollState](../modules/_interface_ipoll_.md#ipollstate)  }): Promise<boolean\>

*Defined in [src/controllers/PollController.ts:24](https://github.com/BESTUPC/voting-web-app/blob/37e241c/src/controllers/PollController.ts#L24)*

#### Parameters:

Name | Type |
------ | ------ |
`userId` | string |
`_id` | string |
`body` | { state: [IPollState](../modules/_interface_ipoll_.md#ipollstate)  } |

**Returns:** Promise<boolean\>
