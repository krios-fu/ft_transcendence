import { IsNotEmpty, IsString } from "class-validator";
import { Request } from "express";

export interface IAuthPayload {
    accessToken: string;
    username: string;
}

export interface IJwtPayload {
    data: {
        username: string
    },
    expiresIn: number,
    iat: number
};

export interface IRequestPayload extends Request {
    jwtPayload: IJwtPayload;
};

export interface IRequestUser extends Request {
    username: string;
};