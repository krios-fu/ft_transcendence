import * as Phaser from 'phaser'
import * as SocketIO from 'socket.io-client'
import { Match } from '../elements/Match';
import { MatchScene } from './MatchScene';

export class    PlayerScene extends MatchScene {

    cursors?: Phaser.Types.Input.Keyboard.CursorKeys;
    powerKeys: any;

    constructor(
        socket: SocketIO.Socket, room: string
    ) {
        super("Player", socket, room);
    }

    override create() {
        //Activate keyboard input
        this.cursors = this.input.keyboard.createCursorKeys(); //up, left, down, right
        this.powerKeys = this.input.keyboard.addKeys({
            up: 'W',
            down: 'S'
        });
        if (this.initData != undefined)
            this.match = new Match(this, this.initData);        
        this.createInitText();
        this.initData = undefined;           
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
    }

}
