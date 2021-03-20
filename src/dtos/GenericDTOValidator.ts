import { plainToClass, ClassConstructor } from 'class-transformer';
import { validate } from 'class-validator';
import ErrorHandler from '../utils/ErrorHandler';

/**
 * Generic validator for given class
 * @param classToBeCasted what object we expect
 * @param objectWithProperties the object to parse
 * @returns The validated object
 * @throws Error when the data is empty or when there is a validation error
 */
export async function validatorGeneric<T>(
    classToBeCasted: ClassConstructor<T>,
    objectWithProperties: unknown,
): Promise<T> {
    try {
        const parsedClass = plainToClass(
            classToBeCasted,
            objectWithProperties,
            {
                excludeExtraneousValues: true,
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
