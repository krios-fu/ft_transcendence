import * as SocketIO from 'socket.io-client'
import { LagCompensationService } from '../services/lag-compensation.service';
import { LoadService } from '../services/load.service';
import { SoundService } from '../services/sound.service';
import { MatchScene } from './MatchScene';

export class    SpectatorScene extends MatchScene {

    constructor(
        sock: SocketIO.Socket, room: string,
        override readonly lagCompensator: LagCompensationService,
        override readonly loadService: LoadService,
        override readonly soundService: SoundService
    ) {
        super("Spectator", sock, room, lagCompensator,
                loadService, soundService);
    }

}
