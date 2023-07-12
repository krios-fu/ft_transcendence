/* Only to be used in development for testing purposes */

import { Type } from "class-transformer";
import { IsNotEmpty, IsString, ValidateNested } from "class-validator";
import { CreateUserDto } from "../user/dto/user.dto";

export class TokenCredentials {
    @IsNotEmpty()
    @ValidateNested()
    @Type(() => CreateUserDto)
    userProfile: CreateUserDto;

    @IsString()
    @IsNotEmpty()
    app_id: string;

    @IsString()
    @IsNotEmpty()
    app_secret: string;
}