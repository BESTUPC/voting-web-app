import { OAuth2Client } from 'google-auth-library';
import { EMembership, IUser } from 'interfaces';
import { validatorGeneric } from '../dtos/GenericDTOValidator';
import { LoginBodyDTO } from '../dtos/LoginBodyDTO';
import { UserModel } from '../models/UserModel';
import { ErrorHandler } from '../utils/ErrorHandler';

/**
 * Controller for the auth-related calls. It handles all the logic between routing and the database access.
 */
export class AuthController {
    /**
     * Login function
     * @param body the token with the payload, should be a [[LoginBodyDTO]]
     * @returns an string with the id of the logged in user.
     */
    public static async signIn(body: unknown): Promise<string> {
        try {
            const client = new OAuth2Client(process.env.CLIENT_ID);
            const { token } = await validatorGeneric<LoginBodyDTO>(LoginBodyDTO, body);
            const ticket = await client.verifyIdToken({
                idToken: token,
            });
            const { name, email, picture, sub } = ticket.getPayload();
            const user: IUser = {
                name,
                email,
                picture,
                userId: sub,
                membership: [EMembership.ALL],
            };
            await UserModel.add(user);
            return sub;
        } catch (e) {
            console.log(e);
            throw new ErrorHandler(404, 'Token format invalid');
        }
    }
}
