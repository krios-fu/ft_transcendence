import {
    IsBoolean, 
    IsEmail, 
    IsEnum, 
    IsNotEmpty, 
    IsNumber, 
    IsOptional, 
    IsString, 
    Length 
} from "class-validator";
import { Category } from "../enums/user.enum";
//import { Category } from "../entities/user.entity";

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
    /*@IsNotEmpty(): Photo URL can be empty !*/
    readonly photoUrl: string;
}

export class UpdateUserDto {
    @IsString()
    @IsNotEmpty()
    @IsOptional()
    photoUrl?: string;

    @IsString()
    @IsNotEmpty()
    @Length(3, 8)
    nickName?: string;

    @IsBoolean()
    @IsNotEmpty()
    doubleAuth?: boolean;

    @IsBoolean()
    @IsNotEmpty()
    acceptedTerms?: boolean;


    @IsBoolean()
    @IsNotEmpty()
    deaultOffline?: boolean;

    @IsOptional()
    @IsNumber()
    @IsNotEmpty()
    ranking?: number;
}

export class UserGameStats {
    @IsOptional()
    @IsNotEmpty()
    @IsNumber()
    ranking?: number;

    @IsOptional()
    @IsNotEmpty()
    @IsEnum(Category)
    category?: Category;
}

export class SettingsPayloadDto {
    @IsBoolean()
    @IsNotEmpty()
    readonly defaultOffline?: boolean;

    @IsBoolean()
    @IsNotEmpty()
    readonly acceptedTerms?: boolean;

    @IsString()
    @IsNotEmpty()
    @Length(3, 8)
    nickName?: string;
}

export class DoubleAuthPayload {
    @IsBoolean()
    @IsNotEmpty()
    readonly doubleAuth?: boolean;

    @IsString()
    @IsNotEmpty()
    doubleAuthSecret: string;
}

