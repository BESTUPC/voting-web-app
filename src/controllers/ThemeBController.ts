import ErrorHandler from '../models/ErrorHandler';

export default class ThemeBController {
    public static async defaultMethod(): Promise<void> {
        throw new ErrorHandler(501, 'Not implemented method');
        /*return {
            text: `You've reached the ${this.constructor.name} default method`
        };*/
    }
}
