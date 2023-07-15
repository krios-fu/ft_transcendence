import {
    GameWsException,
    SocketExceptionCause
} from "./game.wsException";

export class    UnauthorizedWsException extends GameWsException {

    constructor(targetEvent: string, data: any = undefined) {
        super({
            cause: SocketExceptionCause.Unauthorized,
            targetEvent: targetEvent,
            data: data
        });
    }

}
