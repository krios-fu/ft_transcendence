import { IsBoolean, IsEmail, IsNumber, IsOptional, IsString } from "class-validator";
import { Category } from "./user.entity";

export class UserDto {

    username: string;
    firstName: string;
    lastName: string;
    profileUrl: string;
    email: string;
    photoUrl: string;

}

export type Payload = {

    userProfile: UserDto;
    accessToken: string;

};

export class    UpdateUser {

    @IsOptional()
    @IsString()
    nickname?: string;

    @IsOptional()
    @IsEmail()
    email?: string;

    @IsOptional()
    @IsBoolean()
    doubleAuth?: boolean;

    @IsOptional()
    @IsString()
    photoUrl?: string;

    @IsOptional()
    @IsNumber()
    ranking?: number;

    @IsOptional()
    @IsNumber()
    category?: Category;

}
