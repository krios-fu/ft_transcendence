import * as SocketIO from 'socket.io-client'
import { MatchScene } from './MatchScene';

export class    SpectatorScene extends MatchScene {

    constructor(
        sock: SocketIO.Socket, room: string
    ) {
        super("Spectator", sock, room);
    }

}
