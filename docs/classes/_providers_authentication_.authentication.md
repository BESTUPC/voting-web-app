**[webapp](../README.md)**

> [Globals](../globals.md) / ["providers/Authentication"](../modules/_providers_authentication_.md) / Authentication

# Class: Authentication

## Hierarchy

* **Authentication**

## Index

### Methods

* [\_getCredentials](_providers_authentication_.authentication.md#_getcredentials)
* [\_isLoggedIn](_providers_authentication_.authentication.md#_isloggedin)
* [configure](_providers_authentication_.authentication.md#configure)

## Methods

### \_getCredentials

▸ `Static` `Private`**_getCredentials**(): [ICredentials](../interfaces/_interface_icredentials_.icredentials.md) \| null

*Defined in [src/providers/Authentication.ts:64](https://github.com/BESTUPC/voting-web-app/blob/443129a/src/providers/Authentication.ts#L64)*

**Returns:** [ICredentials](../interfaces/_interface_icredentials_.icredentials.md) \| null

___

### \_isLoggedIn

▸ `Static` `Private`**_isLoggedIn**(`req`: Request, `res`: Response, `next`: NextFunction): void

*Defined in [src/providers/Authentication.ts:84](https://github.com/BESTUPC/voting-web-app/blob/443129a/src/providers/Authentication.ts#L84)*

#### Parameters:

Name | Type |
------ | ------ |
`req` | Request |
`res` | Response |
`next` | NextFunction |

**Returns:** void

___

### configure

▸ `Static`**configure**(`app`: Express): void

*Defined in [src/providers/Authentication.ts:10](https://github.com/BESTUPC/voting-web-app/blob/443129a/src/providers/Authentication.ts#L10)*

#### Parameters:

Name | Type |
------ | ------ |
`app` | Express |

**Returns:** void
