import { registerDecorator, ValidationArguments, ValidationOptions } from "class-validator";
import { HasValidFieldsConstraints } from "../validators/fields-validator.class";

export function HasValidFields(validFields: string[], validationOptions?: ValidationOptions) {
    return function(o: Object, propertyName: string) {
        registerDecorator({
            name: 'hasValidFields',
            target: o.constructor,
            propertyName: propertyName,
            constraints: [validFields],
            options: validationOptions,
            validator: HasValidFieldsConstraints
        });
    }
}

export function ValidateOrder(validationOptions?: ValidationOptions) {
    return function(o: Object, propertyName: string) {
        registerDecorator({
            name: 'ValidateOrder',
            target: o.constructor,
            propertyName: propertyName,
            constraints: [],
            options: validationOptions,
            validator: {
                validate(values: string[], args: ValidationArguments): boolean {
                    let cond: boolean = true;
                    values.forEach((value) => {
                        let typevalue = typeof value;
                        console.log('aaa');
                        if (typevalue !== 'string') {
                            cond = false;
                        }
                    });
                    return cond;
                }
            }
        })
    }
}