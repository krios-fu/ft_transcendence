import { registerDecorator, ValidationOptions } from "class-validator";
import { RoomHasValidFieldsConstraints } from "./room-validator.class";

export function HasValidFields(validationOptions?: ValidationOptions) {
    return function(o: Object, propertyName: string) {
        registerDecorator({
            name: 'hasValidFields',
            target: o.constructor,
            propertyName: propertyName,
            constraints: [],
            options: validationOptions,
            validator: RoomHasValidFieldsConstraints
        });
    }
}