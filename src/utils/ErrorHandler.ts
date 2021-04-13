/**
 * Custom error handling class.
 */
export class ErrorHandler extends Error {
    /**
     * Constructor for errors, adds code number and custom message.
     * @param statusCode code number for the error.
     * @param message message for the error.
     */
    constructor(public statusCode: number, public message: string) {
        super();
    }
}
