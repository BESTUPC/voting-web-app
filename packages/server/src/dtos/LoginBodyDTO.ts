import { Expose } from 'class-transformer';
import { IsString } from 'class-validator';
import { LoginBody } from 'interfaces';

/**
 * Data transfer object for vote adding
 */
export class LoginBodyDTO implements LoginBody {
    @Expose()
    @IsString()
    token: string;
}
