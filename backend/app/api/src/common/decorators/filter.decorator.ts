import { registerDecorator, ValidationOptions } from "class-validator";
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