import { Expose } from 'class-transformer';
import {
    IsArray,




    IsString
} from 'class-validator';
import { IVote } from '../interfaces/IVote';

export class VoteAddDTO implements Omit<IVote, '_id'  > {
    @Expose()
    @IsString()
    userId: string;

    @Expose()
    @IsString()
    pollId: string;

    @Expose()
    @IsArray()
    @IsString({each: true})
    option: string[];
    
}
