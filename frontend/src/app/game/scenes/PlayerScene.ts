import * as Phaser from 'phaser'
import * as SocketIO from 'socket.io-client'
import { LagCompensationService } from '../services/lag-compensation.service';
import { LoadService } from '../services/load.service';
import { GameRecoveryService } from '../services/recovery.service';
import { SoundService } from '../services/sound.service';
import { MatchScene } from './MatchScene';

export class    PlayerScene extends MatchScene {

    cursors?: Phaser.Types.Input.Keyboard.CursorKeys;
    powerKeys: any;

    constructor(
        socket: SocketIO.Socket,
        override readonly lagCompensator: LagCompensationService,
        override readonly loadService: LoadService,
        override readonly soundService: SoundService,
        override readonly recoveryService: GameRecoveryService
    ) {
        super("Player", socket,
                lagCompensator, loadService, soundService, recoveryService);
    }

    override create() {
        //Activate keyboard input
        this.cursors = this.input.keyboard.createCursorKeys(); //up, left, down, right
        this.powerKeys = this.input.keyboard.addKeys({
            up: 'W',
            down: 'S'
        });
        super.create();
    }

    override update(time: number) {
        const   currentTime: number = Date.now();
        let     input: [paddleUp: number, heroUp: number] = [0, 0];
    
        if (this.cursors?.up.isDown)
        {
            if (this.match)
                this.socket.emit('paddleUp', currentTime);
            input[0] = 2;
        }
        else if (this.cursors?.down.isDown)
        {
            if (this.match)
                this.socket.emit('paddleDown', currentTime);
            input[0] = 1;
        }
        if (this.powerKeys.up.isDown)
        {
            if (this.match)
                this.socket.emit('heroUp', currentTime);
            input[1] = 2;
        }
        else if (this.powerKeys.down.isDown)
        {
            if (this.match)
                this.socket.emit('heroDown', currentTime);
            input[1] = 1;
        }
        if (input[0] || input[1])
            this.buffer?.input(input[0], input[1], this.match?.snapshot);
        super.update(time);
    }

}
