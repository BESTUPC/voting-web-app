import { ClassConstructor, plainToClass } from 'class-transformer';
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
    const parsedClass = plainToClass(classToBeCasted, objectWithProperties, {
        excludeExtraneousValues: true,
    });

    if (typeof parsedClass !== 'object') {
        throw new ErrorHandler(400, 'No object in request body');
    }

    const errors = await validate(parsedClass as Record<string, unknown>, {
        forbidUnknownValues: true,
    });
    if (errors.length > 0) {
        throw new ErrorHandler(400, errors.toString());
    }

    return parsedClass;
}
