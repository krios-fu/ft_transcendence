import * as Phaser from 'phaser'
import * as SocketIO from 'socket.io-client'
import { LagCompensationService } from '../services/lag-compensation.service';
import { LoadService } from '../services/load.service';
import { GameRecoveryService } from '../services/recovery.service';
import { SoundService } from '../services/sound.service';
import { MatchScene } from './MatchScene';

export class    ClassicPlayerScene extends MatchScene {

    cursors?: Phaser.Types.Input.Keyboard.CursorKeys;

    constructor(
        socket: SocketIO.Socket,
        override readonly lagCompensator: LagCompensationService,
        override readonly loadService: LoadService,
        override readonly soundService: SoundService,
        override readonly recoveryService: GameRecoveryService
    ) {
        super("ClassicPlayer", socket,
                lagCompensator, loadService, soundService, recoveryService);
    }

    override create() {
        //Activate keyboard input
        this.cursors = this.input.keyboard.createCursorKeys(); //up, left, down, right
        super.create();
    }

    override update() {
        const   currentTime: number = Date.now();
    
        if (this.cursors?.up.isDown)
        {
            if (this.match)
                this.socket.emit('paddleUp', currentTime);
        }
        else if (this.cursors?.down.isDown)
        {
            if (this.match)
                this.socket.emit('paddleDown', currentTime);
        }
        super.update();
    }

}
