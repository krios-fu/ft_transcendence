import { WsException } from "@nestjs/websockets";

export enum SocketExceptionCause {
    Unauthorized = "unauthorized",
    Forbidden = "forbidden",
    BadRequest = "badRequest"
}

export interface    SocketError {
    cause: SocketExceptionCause;
    targetEvent: string;
    data: any;
}

export class    GameWsException extends WsException {

    constructor(error: SocketError) {
        super(error);
    }

}
