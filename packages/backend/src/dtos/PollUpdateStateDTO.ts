import { Expose } from 'class-transformer';
import { IsEnum } from 'class-validator';
import { EPollState, IPoll } from '../interfaces/IPoll';

/**
 * Data transfer object for poll state update
 */
export class PollUpdateStateDTO implements Pick<IPoll, 'state'> {
    @Expose()
    @IsEnum(EPollState)
    state: EPollState;
}
