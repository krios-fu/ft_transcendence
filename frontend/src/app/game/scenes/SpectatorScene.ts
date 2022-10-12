import * as SocketIO from 'socket.io-client'
import { BaseScene } from './BaseScene'

export class    SpectatorScene extends BaseScene {
    constructor(
        sock: SocketIO.Socket, room: string, initData: any
    ) {
        super("Spectator", sock, room, initData);
    }
}
