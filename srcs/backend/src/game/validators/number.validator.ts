import { Type } from "class-transformer";
import { IsNotEmpty, IsNumber } from "class-validator";

export class    NumberValidator {

    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number) //Without this it fails for number strings
    fl: number;
}
