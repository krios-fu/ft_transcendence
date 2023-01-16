import * as Phaser from 'phaser'
import * as SocketIO from 'socket.io-client'
import { LagCompensationService } from '../services/lag-compensation.service';
import { MatchScene } from './MatchScene';

export class    PlayerScene extends MatchScene {

    cursors?: Phaser.Types.Input.Keyboard.CursorKeys;
    powerKeys: any;

    constructor(
        socket: SocketIO.Socket, room: string,
        override readonly lagCompensator: LagCompensationService
    ) {
        super("Player", socket, room, lagCompensator);
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

    override update() {
        if (this.cursors?.up.isDown)
            this.socket.emit('paddleUp');
        else if (this.cursors?.down.isDown)
            this.socket.emit('paddleDown');
        if (this.powerKeys.up.isDown)
            this.socket.emit('heroUp');
        else if (this.powerKeys.down.isDown)
            this.socket.emit('heroDown');
        super.update();
    }

}
