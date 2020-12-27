**[webapp](../README.md)**

> [Globals](../globals.md) / [interfaces](../modules/interfaces.md) / IPoll

# Interface: IPoll

Interface for the poll saved in the database.

## Hierarchy

* **IPoll**

## Index

### Properties

* [\_id](interfaces.ipoll.md#_id)
* [description](interfaces.ipoll.md#description)
* [isPriority](interfaces.ipoll.md#ispriority)
* [isPrivate](interfaces.ipoll.md#isprivate)
* [pollDeadline](interfaces.ipoll.md#polldeadline)
* [pollName](interfaces.ipoll.md#pollname)
* [pollOptions](interfaces.ipoll.md#polloptions)
* [state](interfaces.ipoll.md#state)
* [targetGroup](interfaces.ipoll.md#targetgroup)

## Properties

### \_id

• `Optional` **\_id**: ObjectId

*Defined in [src/interfaces/IPoll.ts:9](https://github.com/BESTUPC/voting-web-app/blob/807b76c/src/interfaces/IPoll.ts#L9)*

___

### description

•  **description**: string

*Defined in [src/interfaces/IPoll.ts:10](https://github.com/BESTUPC/voting-web-app/blob/807b76c/src/interfaces/IPoll.ts#L10)*

___

### isPriority

•  **isPriority**: boolean

*Defined in [src/interfaces/IPoll.ts:11](https://github.com/BESTUPC/voting-web-app/blob/807b76c/src/interfaces/IPoll.ts#L11)*

___

### isPrivate

•  **isPrivate**: boolean

*Defined in [src/interfaces/IPoll.ts:12](https://github.com/BESTUPC/voting-web-app/blob/807b76c/src/interfaces/IPoll.ts#L12)*

___

### pollDeadline

•  **pollDeadline**: number

*Defined in [src/interfaces/IPoll.ts:13](https://github.com/BESTUPC/voting-web-app/blob/807b76c/src/interfaces/IPoll.ts#L13)*

___

### pollName

•  **pollName**: string

*Defined in [src/interfaces/IPoll.ts:17](https://github.com/BESTUPC/voting-web-app/blob/807b76c/src/interfaces/IPoll.ts#L17)*

___

### pollOptions

•  **pollOptions**: Array<string\>

*Defined in [src/interfaces/IPoll.ts:16](https://github.com/BESTUPC/voting-web-app/blob/807b76c/src/interfaces/IPoll.ts#L16)*

___

### state

•  **state**: [IPollState](../modules/interfaces.md#ipollstate)

*Defined in [src/interfaces/IPoll.ts:14](https://github.com/BESTUPC/voting-web-app/blob/807b76c/src/interfaces/IPoll.ts#L14)*

___

### targetGroup

•  **targetGroup**: [IMembership](../modules/interfaces.md#imembership)

*Defined in [src/interfaces/IPoll.ts:15](https://github.com/BESTUPC/voting-web-app/blob/807b76c/src/interfaces/IPoll.ts#L15)*
