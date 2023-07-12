import { Type } from "class-transformer";
import { IsNotEmpty, IsNumber, IsString, Matches } from "class-validator";

export class UserCredsDto {
    @IsString()
    @Matches(/[a-z][a-z0-9-]{2,10}/)
    @IsNotEmpty()
    username: string;

    @IsNumber()
    @Type(() => Number)
    @IsNotEmpty()
    id: number;
    
    constructor(
        username: string,
        id: number
    ) {
        this.username = username;
        this.id = id;
    }
}