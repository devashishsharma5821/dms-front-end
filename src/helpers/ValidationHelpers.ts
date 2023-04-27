import Ajv from 'ajv';
import { ErrorLevel, ValidationError } from '../models/transformer';

export class ValidationHelper {
    static validate(schema: string, data: unknown): ValidationError[] {
        const ajv = new Ajv({
            //strict: true,
            allErrors: true,
            multipleOfPrecision: 8
        });

        let level: ErrorLevel = 'schema';

        try {
            ajv.errors = [];
            if (ajv.validateSchema(JSON.parse(schema))) {
                level = 'error';

                ajv.errors = [];
                const validate = ajv.compile(JSON.parse(schema));
                if (validate(data)) return [];
            }
            return [...new Map(ajv.errors.map((error: any) => ({ level: level, message: `${error?.instancePath} ${error?.message}`.replace(/^[\s.]+/u, '') })).map((v) => [v.message, v])).values()];
        } catch (error: unknown) {
            return [{ level: 'error', message: (error as Error).message }];
        }
    }
}
