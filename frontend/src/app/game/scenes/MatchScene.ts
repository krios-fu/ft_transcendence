import * as SocketIO from 'socket.io-client'
import {
    Match,
    IMatchInitData,
    IMatchData
} from '../elements/Match';
import { Txt } from '../elements/Txt';
import { BaseScene } from './BaseScene';

export class    MatchScene extends BaseScene {

    initData?: IMatchInitData;
    match?: Match;

    constructor(
        role: string, socket: SocketIO.Socket, room: string
    ) {
        super(role, socket, room);
    }

    /*  Called when a scene starts
    **  https://rexrainbow.github.io/phaser3-rex-notes/docs/site/scene/#flow-chart
    */
    init(initData: IMatchInitData) {
        if (Object.keys(initData).length != 0)
            this.initData = initData;
        this.socket.once("end", (data) => {
            this.match?.destroy();
            this.removeAllSocketListeners();
            this.scene.start("End", data);
        });
        this.socket.on("matchUpdate", (data: IMatchData) => {
            this.match?.update(data);
        });
        this.socket.on("served", () => {
            if (!this.initTxt)
                return ;
            this.initTxt.visible = false;
        });
    }

    //Called after init()
    preload() {
        this.load.image('aquaman', '/assets/aquaman.png');
        this.load.image('superman', '/assets/superman.png');
        this.load.image('blackPanther', '/assets/blackPanther.png');
        this.load.image('atlantis', '/assets/atlantis.png');
        this.load.image('metropolis', '/assets/metropolis.png');
        this.load.image('wakanda', '/assets/wakanda.png');
    }

    createInitText() {
        //Init screen setup
        this.initTxt = new Txt(this, {
            xPos: 400,
            yPos: 250,
            content: "Prepare to serve ...",
            style: { fontSize: '20px', color: '#fff' },
            xOrigin: 0.5,
            yOrigin: 0.5,
            depth: 1
        });
    }

    //Called after preload()
    create() {
        if (this.initData != undefined)
            this.match = new Match(this, this.initData);        
        this.createInitText();
        this.initData = undefined;
    }

}
