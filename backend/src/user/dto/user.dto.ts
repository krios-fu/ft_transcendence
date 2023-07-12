import {
    IsBoolean,
    IsEmail,
    IsEnum,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
    Length, Matches
} from "class-validator";
import { Category } from "../enum/category.enum";

export class CreateUserDto {
    @IsString()
    /*@Length(3, 8)*/
    @Matches(/^[a-z][a-z0-9-]{2,10}$/,
        { message: 'bad username format'})
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
    @IsOptional()
    readonly photoUrl: string | null;
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
    defaultOffline?: boolean;

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

