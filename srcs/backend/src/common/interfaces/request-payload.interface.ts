import { Request } from "express";

export interface IAuthPayload {
    accessToken: string;
    username: string;
    id: number;
    firstTime?: boolean;
}

export interface IJwtPayload {
    data: {
        username: string,
        id: number;
        validated: boolean
    },
    expiresIn: number,
    iat: number
};

export interface IRequestUser extends Request {
    user: IJwtPayload;
};
