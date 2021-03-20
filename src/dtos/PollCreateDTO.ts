import { Expose, Transform } from 'class-transformer';
import {
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
    @Transform(({ value }: { value: unknown }) =>
        typeof value !== 'number' ? new Date().getTime() : value * 1000,
    )
    pollDeadline: number;

    @Expose()
    @IsEnum(EMembership)
    targetGroup: EMembership;

    @Expose()
    @IsArray()
    @IsString({ each: true })
    pollOptions: string[];

    @Expose()
    @IsString()
    @Transform(({ value }: { value: unknown }) =>
        value === undefined ? '' : value,
    )
    description: string;

    @Expose()
    @IsString()
    pollName: string;
}
