import { Expose } from 'class-transformer';
import { IsArray, IsEnum } from 'class-validator';
import { EMembership, IUser } from '../interfaces/IUser';

/**
 * Data transfer object for user membership update
 */
export class UserUpdateMembershipDTO implements Pick<IUser, 'membership'> {
    @Expose()
    @IsArray()
    @IsEnum(EMembership, { each: true })
    membership: EMembership[];
}
