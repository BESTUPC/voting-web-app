import { plainToClass, ClassConstructor } from 'class-transformer';
import { validate } from 'class-validator';
import ErrorHandler from '../models/ErrorHandler';

/**
 * Generic validator for given class
 * @param classToBeCasted
 * @param objectWithProperties
 * @param excludeExtraneousValues
 * @throws ResponseError when the data is empty or when there is a validation error
 */
export async function validatorGeneric<T>(
    classToBeCasted: ClassConstructor<T>,
    objectWithProperties: unknown,
    excludeExtraneousValues = true,
): Promise<T> {
    try {
        const parsedClass = plainToClass(
            classToBeCasted,
            objectWithProperties,
            {
                excludeExtraneousValues,
            },
        );

        if (!parsedClass) {
            throw new ErrorHandler(400, 'No data');
        }

        const errors = await validate(
            (parsedClass as unknown) as Record<string, unknown>,
        );

        if (errors.length > 0) {
            throw new ErrorHandler(400, errors.toString());
        }
        return parsedClass;
    } catch (error) {
        throw new ErrorHandler(400, error.toString());
    }
}
