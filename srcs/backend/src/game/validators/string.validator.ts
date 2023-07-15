import { IsNotEmpty, IsString } from "class-validator";

export class    StringValidator {

    @IsNotEmpty()
    @IsString()
    str: string;

}
