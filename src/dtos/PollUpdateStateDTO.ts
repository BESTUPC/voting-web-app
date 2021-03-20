import { Expose } from 'class-transformer';
import { IsEnum } from 'class-validator';
import { EPollState, IPoll } from '../interfaces/IPoll';

export class PollUpdateStateDTO implements Pick<IPoll, 'state'> {
    @Expose()
    @IsEnum(EPollState)
    state: EPollState;
}
