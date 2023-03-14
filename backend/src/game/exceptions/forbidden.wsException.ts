import {
    GameWsException,
    SocketExceptionCause
} from "./game.wsException";

export class    ForbiddenWsException extends GameWsException {

    constructor(targetEvent: string, data: any = undefined) {
        super({
            cause: SocketExceptionCause.Forbidden,
            targetEvent: targetEvent,
            data: data
        });
    }

}
  