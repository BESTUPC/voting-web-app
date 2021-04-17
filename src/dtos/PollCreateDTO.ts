import { Expose, Type } from 'class-transformer';
import {
    ArrayMinSize,
    IsArray,
    IsBoolean,
    IsEnum,
    IsNumber,
    IsString,
    MinLength,
    registerDecorator,
    ValidateNested,
    ValidationArguments,
} from 'class-validator';
import { EPollApprovalRatio, IPoll, IPollOption } from '../interfaces/IPoll';
import { EMembership } from '../interfaces/IUser';

/**
 * Data transfer object for poll creation
 */
export class PollCreateDTO implements Omit<IPoll, '_id' | 'state'> {
    @Expose()
    @IsEnum(EPollApprovalRatio)
    approvalRatio: EPollApprovalRatio;

    @Expose()
    @IsBoolean()
    abstentionIsValid: boolean;

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
    @ValidateNested({ each: true })
    @ArrayMinSize(2)
    @Type(() => PollOption)
    @DistinctPollOptionName()
    pollOptions: IPollOption[];

    @Expose()
    @IsString()
    @MinLength(1)
    description: string;

    @Expose()
    @IsString()
    @MinLength(1)
    pollName: string;
}

export class PollOption implements IPollOption {
    @Expose()
    @IsString()
    @MinLength(1)
    name: string;

    @Expose()
    @IsBoolean()
    @NotBoth('isAgainst')
    isAbstention: boolean;

    @Expose()
    @IsBoolean()
    @NotBoth('isAbstention')
    isAgainst: boolean;
}

function DistinctPollOptionName() {
    return (object: PollCreateDTO, propertyName: string): void => {
        registerDecorator({
            name: 'ArrayDistinct',
            target: object.constructor,
            propertyName,
            validator: {
                validate(value: IPollOption[]): boolean {
                    if (Array.isArray(value)) {
                        const distinct = [...new Set(value.map((v) => v.name))];
                        return distinct.length === value.length;
                    }
                    return false;
                },
            },
        });
    };
}

function NotBoth(property: string) {
    return (object: PollOption, propertyName: string) => {
        registerDecorator({
            target: object.constructor,
            propertyName,
            constraints: [property],
            validator: {
                validate(value: boolean, args: ValidationArguments) {
                    const [relatedPropertyName] = args.constraints;
                    const relatedValue = (args.object as PollOption)[
                        relatedPropertyName
                    ];
                    return !(value === true && relatedValue === true);
                },
            },
        });
    };
}
