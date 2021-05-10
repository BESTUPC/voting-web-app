import { Expose } from 'class-transformer';
import { IsArray, IsEnum } from 'class-validator';
import { IUser, EMembership } from 'interfaces';

/**
 * Data transfer object for user membership update
 */
export class UserUpdateMembershipDTO implements Pick<IUser, 'membership'> {
    @Expose()
    @IsArray()
    @IsEnum(EMembership, { each: true })
    membership: EMembership[];
}
