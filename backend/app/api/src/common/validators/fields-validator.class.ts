import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";

@ValidatorConstraint({ name: 'roomHasValidFieldsConstraints', async: true })
export class HasValidFieldsConstraints implements ValidatorConstraintInterface {
    //validFields: string[] = ['id', 'roomName', 'createdAt', 'ownerId'];

    validate(fields: string[], args: ValidationArguments): boolean {
        const validFields: string[] = args.constraints;
        let cond: boolean = true;

        fields.forEach((field: string) => {
            if (!validFields.includes(field)) {
                cond = false;
            }
        });
        return cond;
    }

    defaultMessage(validationArguments?: ValidationArguments): string {
        return 'Parameter cannot be set for sorting';
    }
}