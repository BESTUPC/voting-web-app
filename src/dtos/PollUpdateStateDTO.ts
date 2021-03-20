import { Expose, Transform } from 'class-transformer';
import {
    IsArray,
    IsBoolean,
    IsDate,
    IsEnum,
    IsOptional,
    IsString,
} from 'class-validator';
import { IPoll, EPollState } from '../interfaces/IPoll';
import { EMembership } from '../interfaces/IUser';

export class PollUpdateStateDTO implements Pick<IPoll, 'state'> {
    @Expose()
    @IsEnum(EPollState)
    state: EPollState;
}
