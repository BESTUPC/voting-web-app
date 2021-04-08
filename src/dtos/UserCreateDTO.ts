import { Expose } from 'class-transformer';
import { IsArray, IsOptional, IsString } from 'class-validator';
import { IGoogleUser } from '../interfaces/IUser';

/**
 * Data transfer object for user creation
 */
export class UserCreateDTO implements IGoogleUser {
    @Expose()
    @IsString()
    id: string;

    @Expose()
    @IsString()
    displayName: string;

    @Expose()
    @IsOptional()
    @IsArray()
    emails: { value: string }[];
}
