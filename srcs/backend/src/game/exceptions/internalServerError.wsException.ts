import {
    SocketExceptionCause, 
    GameWsException 
} from "./game.wsException";


export class InternalServerErrorWsException extends GameWsException {

    constructor(targetEvent: string, data: any = undefined) {
        super({
            cause: SocketExceptionCause.InternalServerError,
            targetEvent: targetEvent,
            data: data
        });
    }
}