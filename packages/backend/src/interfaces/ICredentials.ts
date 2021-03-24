/**
 * Interface for the data obtain from the google auth credentials file.
 */
export interface ICredentials {
    clientID: string;
    clientSecret: string;
    callbackURL: string;
}
