**[webapp](../README.md)**

> [Globals](../globals.md) / interface

# Module: interface

## Index

### Interfaces

* [ICertificates](../interfaces/interface.icertificates.md)
* [ICredentials](../interfaces/interface.icredentials.md)
* [IPoll](../interfaces/interface.ipoll.md)
* [IUser](../interfaces/interface.iuser.md)

### Type aliases

* [IMembership](interface.md#imembership)
* [IPollState](interface.md#ipollstate)

### Functions

* [isIMembership](interface.md#isimembership)
* [isIMembershipArray](interface.md#isimembershiparray)
* [isIPoll](interface.md#isipoll)
* [isIPollState](interface.md#isipollstate)
* [isIUser](interface.md#isiuser)

## Type aliases

### IMembership

Ƭ  **IMembership**: \"all\" \| \"member\" \| \"full\" \| \"admin\"

*Defined in [src/interface/IUser.ts:17](https://github.com/BESTUPC/voting-web-app/blob/67fed0c/src/interface/IUser.ts#L17)*

___

### IPollState

Ƭ  **IPollState**: \"open\" \| \"closed\"

*Defined in [src/interface/IPoll.ts:24](https://github.com/BESTUPC/voting-web-app/blob/67fed0c/src/interface/IPoll.ts#L24)*

## Functions

### isIMembership

▸ **isIMembership**(`x`: unknown): x is IMembership

*Defined in [src/interface/IUser.ts:24](https://github.com/BESTUPC/voting-web-app/blob/67fed0c/src/interface/IUser.ts#L24)*

#### Parameters:

Name | Type |
------ | ------ |
`x` | unknown |

**Returns:** x is IMembership

___

### isIMembershipArray

▸ **isIMembershipArray**(`x`: unknown): x is Array<IMembership\>

*Defined in [src/interface/IUser.ts:19](https://github.com/BESTUPC/voting-web-app/blob/67fed0c/src/interface/IUser.ts#L19)*

#### Parameters:

Name | Type |
------ | ------ |
`x` | unknown |

**Returns:** x is Array<IMembership\>

___

### isIPoll

▸ **isIPoll**(`x`: unknown): x is IPoll

*Defined in [src/interface/IPoll.ts:17](https://github.com/BESTUPC/voting-web-app/blob/67fed0c/src/interface/IPoll.ts#L17)*

#### Parameters:

Name | Type |
------ | ------ |
`x` | unknown |

**Returns:** x is IPoll

___

### isIPollState

▸ **isIPollState**(`x`: unknown): x is IPollState

*Defined in [src/interface/IPoll.ts:26](https://github.com/BESTUPC/voting-web-app/blob/67fed0c/src/interface/IPoll.ts#L26)*

#### Parameters:

Name | Type |
------ | ------ |
`x` | unknown |

**Returns:** x is IPollState

___

### isIUser

▸ **isIUser**(`x`: unknown): x is IUser

*Defined in [src/interface/IUser.ts:10](https://github.com/BESTUPC/voting-web-app/blob/67fed0c/src/interface/IUser.ts#L10)*

#### Parameters:

Name | Type |
------ | ------ |
`x` | unknown |

**Returns:** x is IUser
