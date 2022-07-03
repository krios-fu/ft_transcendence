import { Request } from "express";
import { IJwtPayload } from "./ijwt-payload.interface";

export interface IRequestPayload extends Request {
    jwtPayload: IJwtPayload;
}