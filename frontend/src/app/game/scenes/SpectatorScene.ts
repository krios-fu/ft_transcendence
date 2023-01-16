import * as SocketIO from 'socket.io-client'
import { LagCompensationService } from '../services/lag-compensation.service';
import { MatchScene } from './MatchScene';

export class    SpectatorScene extends MatchScene {

    constructor(
        sock: SocketIO.Socket, room: string,
        override readonly lagCompensator: LagCompensationService
    ) {
        super("Spectator", sock, room, lagCompensator);
    }

}
