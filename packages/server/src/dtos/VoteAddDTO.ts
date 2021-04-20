import { Expose } from 'class-transformer';
import { IsArray, IsString } from 'class-validator';
import { IVote } from '../interfaces/IVote';

/**
 * Data transfer object for vote adding
 */
export class VoteAddDTO implements Omit<IVote, '_id' | 'userId'> {
    @Expose()
    @IsString()
    pollId: string;

    @Expose()
    @IsArray()
    @IsString({ each: true })
    option: string[];
}
