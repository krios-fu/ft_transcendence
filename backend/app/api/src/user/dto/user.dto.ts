import {
    IsBoolean, 
    IsEmail, 
    IsNotEmpty, 
    IsString, 
    Length 
} from "class-validator";

export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    readonly username: string;

    @IsString()
    @IsNotEmpty()
    readonly firstName: string;

    @IsString()
    @IsNotEmpty()
    readonly lastName: string;

    @IsString()
    @IsNotEmpty()
    readonly profileUrl: string;

    @IsEmail()
    @IsNotEmpty()
    readonly email: string;

    @IsString()
    @IsNotEmpty()
    readonly photoUrl: string;
}

export class UpdateUserDto {
    @IsString()
    @IsNotEmpty()
    photoUrl?: string;

    @IsString()
    @IsNotEmpty()
    @Length(9, 12)
    nickName?: string;

    @IsBoolean()
    @IsNotEmpty()
    doubleAuth?: boolean;
}

export class SettingsPayloadDto {
    @IsBoolean()
    @IsNotEmpty()
    readonly isInvisible?: boolean;

    @IsBoolean()
    @IsNotEmpty()
    readonly acceptedTerms?: boolean;

    @IsBoolean()
    @IsNotEmpty()
    readonly doubleAuth?: boolean;

}

