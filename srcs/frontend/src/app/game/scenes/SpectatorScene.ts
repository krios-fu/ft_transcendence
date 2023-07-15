import * as SocketIO from 'socket.io-client'
import { LagCompensationService } from '../services/lag-compensation.service';
import { LoadService } from '../services/load.service';
import { GameRecoveryService } from '../services/recovery.service';
import { SoundService } from '../services/sound.service';
import { MatchScene } from './MatchScene';

export class    SpectatorScene extends MatchScene {

    constructor(
        sock: SocketIO.Socket,
        override readonly lagCompensator: LagCompensationService,
        override readonly loadService: LoadService,
        override readonly soundService: SoundService,
        override readonly recoveryService: GameRecoveryService
    ) {
        super("Spectator", sock,
                lagCompensator, loadService, soundService, recoveryService);
    }

}
