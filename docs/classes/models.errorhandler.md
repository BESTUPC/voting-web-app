**[webapp](../README.md)**

> [Globals](../globals.md) / [models](../modules/models.md) / ErrorHandler

# Class: ErrorHandler

Custom error handling class.

## Hierarchy

* [Error](models.errorhandler.md#error)

  ↳ **ErrorHandler**

## Index

### Constructors

* [constructor](models.errorhandler.md#constructor)

### Properties

* [message](models.errorhandler.md#message)
* [name](models.errorhandler.md#name)
* [stack](models.errorhandler.md#stack)
* [statusCode](models.errorhandler.md#statuscode)
* [Error](models.errorhandler.md#error)

## Constructors

### constructor

\+ **new ErrorHandler**(`statusCode`: number, `message`: string): [ErrorHandler](models.errorhandler.md)

*Defined in [src/models/ErrorHandler.ts:4](https://github.com/BESTUPC/voting-web-app/blob/3f5c425/src/models/ErrorHandler.ts#L4)*

Constructor for errors, adds code number and custom message.

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`statusCode` | number | code number for the error. |
`message` | string | message for the error.  |

**Returns:** [ErrorHandler](models.errorhandler.md)

## Properties

### message

•  **message**: string

*Overrides void*

*Defined in [src/models/ErrorHandler.ts:10](https://github.com/BESTUPC/voting-web-app/blob/3f5c425/src/models/ErrorHandler.ts#L10)*

message for the error.

___

### name

•  **name**: string

*Inherited from [ErrorHandler](models.errorhandler.md).[name](models.errorhandler.md#name)*

*Defined in node_modules/typescript/lib/lib.es5.d.ts:973*

___

### stack

• `Optional` **stack**: string

*Inherited from [ErrorHandler](models.errorhandler.md).[stack](models.errorhandler.md#stack)*

*Defined in node_modules/typescript/lib/lib.es5.d.ts:975*

___

### statusCode

•  **statusCode**: number

*Defined in [src/models/ErrorHandler.ts:10](https://github.com/BESTUPC/voting-web-app/blob/3f5c425/src/models/ErrorHandler.ts#L10)*

code number for the error.

___

### Error

▪ `Static` **Error**: ErrorConstructor

*Defined in node_modules/typescript/lib/lib.es5.d.ts:984*
