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

export interface IRequestUser extends Request {
    user: IJwtPayload;
};