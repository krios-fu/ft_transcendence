import { Request } from "express";

export interface IJwtPayload {
    accessToken: string;
    username: string;
}

export interface IRequestPayload extends Request {
    jwtPayload: IJwtPayload;
}

export interface IRequestUser extends Request {
    username: string;
}