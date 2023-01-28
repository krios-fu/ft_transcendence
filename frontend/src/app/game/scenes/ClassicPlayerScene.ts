import * as Phaser from 'phaser'
import * as SocketIO from 'socket.io-client'
import { LagCompensationService } from '../services/lag-compensation.service';
import { MatchScene } from './MatchScene';

export class    ClassicPlayerScene extends MatchScene {

    cursors?: Phaser.Types.Input.Keyboard.CursorKeys;

    constructor(
        socket: SocketIO.Socket, room: string,
        override readonly lagCompensator: LagCompensationService
    ) {
        super("ClassicPlayer", socket, room, lagCompensator);
    }

    override create() {
        //Activate keyboard input
        this.cursors = this.input.keyboard.createCursorKeys(); //up, left, down, right
        super.create();
    }

    override update(time: number) {
        const   currentTime: number = Date.now();
        let     input: number = 0;
    
        if (this.cursors?.up.isDown)
        {
            this.socket.emit('paddleUp', currentTime);
            input = 2;
        }
        else if (this.cursors?.down.isDown)
        {
            this.socket.emit('paddleDown', currentTime);
            input = 1;
        }
        if (input)
            this.buffer?.input(input, 0, this.match?.snapshot);
        super.update(time);
    }

}
