import { IsString } from "class-validator";

export class AuthToken {
    @IsString()
    'accessToken': string;
};