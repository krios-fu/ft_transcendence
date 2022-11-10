import * as Phaser from 'phaser'
import * as SocketIO from 'socket.io-client'
import { Match } from '../elements/Match';
import { MatchScene } from './MatchScene';

export class    PlayerScene extends MatchScene {

    cursors?: Phaser.Types.Input.Keyboard.CursorKeys;
    powerKeys: any;

    constructor(
        role: string, socket: SocketIO.Socket, room: string
    ) {
        super(role, socket, room);
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

}
