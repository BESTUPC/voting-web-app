**[webapp](../README.md)**

> [Globals](../globals.md) / [providers](../modules/providers.md) / Authentication

# Class: Authentication

Class to setup the Passport.js and cookie-session middleware.

## Hierarchy

* **Authentication**

## Index

### Methods

* [\_getCredentials](providers.authentication.md#_getcredentials)
* [\_isLoggedIn](providers.authentication.md#_isloggedin)
* [configure](providers.authentication.md#configure)

## Methods

### \_getCredentials

▸ `Static` `Private`**_getCredentials**(): [ICredentials](../interfaces/interfaces.icredentials.md) \| null

*Defined in [src/providers/Authentication.ts:80](https://github.com/BESTUPC/voting-web-app/blob/3f5c425/src/providers/Authentication.ts#L80)*

In charge of opening the files with Google OAuth credentials.

**Returns:** [ICredentials](../interfaces/interfaces.icredentials.md) \| null

Returns the credentials obtained or null if not found.

___

### \_isLoggedIn

▸ `Static` `Private`**_isLoggedIn**(`req`: Request, `res`: Response, `next`: NextFunction): void

*Defined in [src/providers/Authentication.ts:106](https://github.com/BESTUPC/voting-web-app/blob/3f5c425/src/providers/Authentication.ts#L106)*

Auxiliary middleware function to controll logged in access.

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`req` | Request | server request. |
`res` | Response | response to the request. |
`next` | NextFunction | function to execute next.  |

**Returns:** void

___

### configure

▸ `Static`**configure**(`app`: Express): void

*Defined in [src/providers/Authentication.ts:17](https://github.com/BESTUPC/voting-web-app/blob/3f5c425/src/providers/Authentication.ts#L17)*

Configures the serialization of user, gets the OAuth Google credentials, sets up the cookie session and the authentication endpoints.

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`app` | Express | Express app to setup.  |

**Returns:** void
