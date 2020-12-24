**[webapp](../README.md)**

> [Globals](../globals.md) / "interface/IUser"

# Module: "interface/IUser"

## Index

### Interfaces

* [IUser](../interfaces/_interface_iuser_.iuser.md)

### Type aliases

* [IMembership](_interface_iuser_.md#imembership)

### Functions

* [isIMembership](_interface_iuser_.md#isimembership)
* [isIMembershipArray](_interface_iuser_.md#isimembershiparray)
* [isIUser](_interface_iuser_.md#isiuser)

## Type aliases

### IMembership

Ƭ  **IMembership**: \"all\" \| \"member\" \| \"full\" \| \"admin\"

*Defined in [src/interface/IUser.ts:17](https://github.com/BESTUPC/voting-web-app/blob/08738de/src/interface/IUser.ts#L17)*

## Functions

### isIMembership

▸ **isIMembership**(`x`: unknown): x is IMembership

*Defined in [src/interface/IUser.ts:24](https://github.com/BESTUPC/voting-web-app/blob/08738de/src/interface/IUser.ts#L24)*

#### Parameters:

Name | Type |
------ | ------ |
`x` | unknown |

**Returns:** x is IMembership

___

### isIMembershipArray

▸ **isIMembershipArray**(`x`: unknown): x is Array<IMembership\>

*Defined in [src/interface/IUser.ts:19](https://github.com/BESTUPC/voting-web-app/blob/08738de/src/interface/IUser.ts#L19)*

#### Parameters:

Name | Type |
------ | ------ |
`x` | unknown |

**Returns:** x is Array<IMembership\>

___

### isIUser

▸ **isIUser**(`x`: unknown): x is IUser

*Defined in [src/interface/IUser.ts:10](https://github.com/BESTUPC/voting-web-app/blob/08738de/src/interface/IUser.ts#L10)*

#### Parameters:

Name | Type |
------ | ------ |
`x` | unknown |

**Returns:** x is IUser
