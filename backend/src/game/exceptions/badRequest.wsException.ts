import {
    GameWsException,
    SocketExceptionCause
} from "./game.wsException";

export class    BadRequestWsException extends GameWsException {

    constructor(targetEvent: string, data: any = undefined) {
        super({
            cause: SocketExceptionCause.BadRequest,
            targetEvent: targetEvent,
            data: data
        });
    }

}
