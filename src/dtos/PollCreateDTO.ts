import { Expose } from 'class-transformer';
import {
    ArrayMinSize,
    IsArray,
    IsBoolean,
    IsEnum,
    IsNumber,
    IsString,
} from 'class-validator';
import { IPoll } from '../interfaces/IPoll';
import { EMembership } from '../interfaces/IUser';

/**
 * Data transfer object for poll creation
 */
export class PollCreateDTO implements Omit<IPoll, '_id' | 'state'> {
    @Expose()
    @IsBoolean()
    isPriority: boolean;

    @Expose()
    @IsBoolean()
    isPrivate: boolean;

    @Expose()
    @IsNumber()
    pollDeadline: number;

    @Expose()
    @IsEnum(EMembership)
    targetGroup: EMembership;

    @Expose()
    @IsArray()
    @IsString({ each: true })
    @ArrayMinSize(2)
    pollOptions: string[];

    @Expose()
    @IsString()
    description: string;

    @Expose()
    @IsString()
    pollName: string;
}
