import * as Phaser from 'phaser'
import * as SocketIO from 'socket.io-client'
import { LagCompensationService } from '../services/lag-compensation.service';
import { LoadService } from '../services/load.service';
import { GameRecoveryService } from '../services/recovery.service';
import { SoundService } from '../services/sound.service';
import { MatchScene } from './MatchScene';

export class    ClassicPlayerScene extends MatchScene {

    cursors?: Phaser.Types.Input.Keyboard.CursorKeys;

    private _lastInput: number;

    constructor(
        socket: SocketIO.Socket,
        override readonly lagCompensator: LagCompensationService,
        override readonly loadService: LoadService,
        override readonly soundService: SoundService,
        override readonly recoveryService: GameRecoveryService
    ) {
        super("ClassicPlayer", socket,
                lagCompensator, loadService, soundService, recoveryService);
        this._lastInput = 0;
    }

    override create() {
        //Activate keyboard input
        this.cursors = this.input.keyboard.createCursorKeys(); //up, left, down, right
        super.create();
    }

    override update() {
        const   currentTime: number = Date.now();
        const   allowInput: boolean = currentTime - this._lastInput > 30;
    
        if (this.cursors?.up.isDown && allowInput)
        {
            if (this.match)
                this.socket.emit('paddleUp', currentTime);
            this._lastInput = currentTime;
        }
        else if (this.cursors?.down.isDown && allowInput)
        {
            if (this.match)
                this.socket.emit('paddleDown', currentTime);
            this._lastInput = currentTime;
        }
        super.update();
    }

}
