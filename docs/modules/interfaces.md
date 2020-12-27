**[webapp](../README.md)**

> [Globals](../globals.md) / interfaces

# Module: interfaces

## Index

### Interfaces

* [ICertificates](../interfaces/interfaces.icertificates.md)
* [ICredentials](../interfaces/interfaces.icredentials.md)
* [IGoogleUser](../interfaces/interfaces.igoogleuser.md)
* [IPoll](../interfaces/interfaces.ipoll.md)
* [IUser](../interfaces/interfaces.iuser.md)

### Type aliases

* [IMembership](interfaces.md#imembership)
* [IPollState](interfaces.md#ipollstate)

### Functions

* [isIGoogleUser](interfaces.md#isigoogleuser)
* [isIMembership](interfaces.md#isimembership)
* [isIMembershipArray](interfaces.md#isimembershiparray)
* [isIPoll](interfaces.md#isipoll)
* [isIPollState](interfaces.md#isipollstate)

## Type aliases

### IMembership

Ƭ  **IMembership**: \"all\" \| \"member\" \| \"full\" \| \"admin\"

*Defined in [src/interfaces/IUser.ts:35](https://github.com/BESTUPC/voting-web-app/blob/807b76c/src/interfaces/IUser.ts#L35)*

Custom type for the different memberships a user can have.

___

### IPollState

Ƭ  **IPollState**: \"open\" \| \"closed\" \| \"closed\_hidden\"

*Defined in [src/interfaces/IPoll.ts:43](https://github.com/BESTUPC/voting-web-app/blob/807b76c/src/interfaces/IPoll.ts#L43)*

Custom type for the different states the poll can have.

## Functions

### isIGoogleUser

▸ **isIGoogleUser**(`x`: unknown): x is IGoogleUser

*Defined in [src/interfaces/IUser.ts:27](https://github.com/BESTUPC/voting-web-app/blob/807b76c/src/interfaces/IUser.ts#L27)*

Typeguard for [IGoogleUser](../interfaces/interfaces.igoogleuser.md).

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`x` | unknown | object to check.  |

**Returns:** x is IGoogleUser

___

### isIMembership

▸ **isIMembership**(`x`: unknown): x is IMembership

*Defined in [src/interfaces/IUser.ts:51](https://github.com/BESTUPC/voting-web-app/blob/807b76c/src/interfaces/IUser.ts#L51)*

Typeguard for [IMembership](interfaces.md#imembership).

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`x` | unknown | object to check.  |

**Returns:** x is IMembership

___

### isIMembershipArray

▸ **isIMembershipArray**(`x`: unknown): x is Array<IMembership\>

*Defined in [src/interfaces/IUser.ts:41](https://github.com/BESTUPC/voting-web-app/blob/807b76c/src/interfaces/IUser.ts#L41)*

Typeguard for array of [IMembership](interfaces.md#imembership).

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`x` | unknown | object to check.  |

**Returns:** x is Array<IMembership\>

___

### isIPoll

▸ **isIPoll**(`x`: unknown): x is IPoll

*Defined in [src/interfaces/IPoll.ts:24](https://github.com/BESTUPC/voting-web-app/blob/807b76c/src/interfaces/IPoll.ts#L24)*

Typeguard for [IPoll](../interfaces/interfaces.ipoll.md).

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`x` | unknown | object to be checked.  |

**Returns:** x is IPoll

___

### isIPollState

▸ **isIPollState**(`x`: unknown): x is IPollState

*Defined in [src/interfaces/IPoll.ts:49](https://github.com/BESTUPC/voting-web-app/blob/807b76c/src/interfaces/IPoll.ts#L49)*

Typeguard for [IPollState](interfaces.md#ipollstate).

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`x` | unknown | object to be checked.  |

**Returns:** x is IPollState
