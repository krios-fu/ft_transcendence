import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";

@ValidatorConstraint({ name: 'roomHasValidFieldsConstraints', async: true })
export class HasValidFieldsConstraints implements ValidatorConstraintInterface {
    validate(fields: string[], args: ValidationArguments): boolean {
        const validFields: string[] = args.constraints;
        let cond: boolean = true;

        fields.forEach((field: string) => {
            if (!validFields.indexOf(field)) {
                cond = false;
            }
        });
        return cond;
    }

    defaultMessage(validationArguments?: ValidationArguments): string {
        return 'Parameter cannot be set for sorting';
    }
}

export function intoArrayOfParams(value: string[]) {
    let ids = new Array<string>();
    let params = (!Array.isArray(value)) ? [ value ] : value;

    params.forEach((params: string) => {
        params.split(',').filter(Boolean).forEach((param: string) => {
            ids.push(param);
        });
    });
    return ids;
}