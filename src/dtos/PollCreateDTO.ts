import { Expose, Transform } from 'class-transformer';
import { IsArray, IsBoolean, IsDate, IsEnum, IsString } from 'class-validator';
import { IPoll } from '../interfaces/IPoll';
import { EMembership } from '../interfaces/IUser';

export class PollCreateDTO implements Omit<IPoll, '_id' | 'state'> {
    @Expose()
    @IsBoolean()
    isPriority: boolean;

    @Expose()
    @IsBoolean()
    isPrivate: boolean;

    @Expose()
    @IsDate()
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
