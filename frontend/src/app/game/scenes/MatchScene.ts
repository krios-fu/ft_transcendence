import * as SocketIO from 'socket.io-client'
import {
    AStage,
    StageKeys
} from '../elements/AStage';
import {
    Match,
    IMatchInitData,
    IMatchData
} from '../elements/Match';
import { Txt } from '../elements/Txt';
import { SnapshotBuffer } from '../elements/SnapshotBuffer';
import { LagCompensationService } from '../services/lag-compensation.service';
import { BaseScene } from './BaseScene';

export interface    IMatchSceneInit {
    role: string;
    matchData: IMatchInitData;
}

export class    MatchScene extends BaseScene {

    initData?: IMatchSceneInit;
    match?: Match;
    buffer?: SnapshotBuffer;
    queue: IMatchData[];
    lastServerUpdate: number;

    static readonly serverUpdateInterval = 50;

    constructor(
        role: string, socket: SocketIO.Socket, room: string,
        readonly lagCompensator: LagCompensationService
    ) {
        super(role, socket, room);
        this.queue = [];
        this.lastServerUpdate = Date.now();
    }

    /*  Called when a scene starts
    **  https://rexrainbow.github.io/phaser3-rex-notes/docs/site/scene/#flow-chart
    */
    init(initData: IMatchSceneInit) {
        if (Object.keys(initData).length != 0)
            this.initData = initData;
        this.socket.once("end", (data) => {
            this.match?.destroy();
            this.buffer = undefined;
            this.removeAllSocketListeners();
            this.scene.start("End", data);
        });
        this.socket.on("matchUpdate", (snapshot: IMatchData) => {
            this.queue.push(snapshot);
        });
        this.socket.on("served", () => {
            if (!this.initTxt)
                return ;
            this.initTxt.visible = false;
        });
    }

    //Called after init()
    preload() {
        const   stageKeys: StageKeys = AStage.stageKeys;
    
        this.load.image('aquaman', '/assets/aquaman.png');
        this.load.image('superman', '/assets/superman.png');
        this.load.image('blackPanther', '/assets/blackPanther.png');
        this.load.image(stageKeys.atlantis, '/assets/atlantis.png');
        this.load.image(stageKeys.atlantisBubbles,
                            '/assets/atlantis_bubbles.png');
        this.load.image(stageKeys.metropolis, '/assets/metropolis.png');
        this.load.image(stageKeys.metropolisClouds,
                            '/assets/metropolis_clouds.png');
        this.load.image(stageKeys.wakanda, '/assets/wakanda.png');
        this.load.image(stageKeys.wakandaCity, '/assets/wakanda_city.png');
        this.load.image(stageKeys.wakandaJungle, '/assets/wakanda_jungle.png');
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
        {
            this.match = new Match(this, this.initData.matchData);
            this.buffer = new SnapshotBuffer(
                {
                    gameWidth: Number(this.game.config.width),
                    gameHeight: Number(this.game.config.height),
                    matchData: this.initData.matchData,
                    role: this.initData.role
                },
                this.lagCompensator
            );
            this.queue = [];
        }
        this.createInitText();
        this.initData = undefined;
    }

    override update(time: number) {    
        if (!this.match || !this.buffer)
            return ;
        this.match.update(
            this.buffer.getSnapshot()
        );
        if (time - this.lastServerUpdate
                >= MatchScene.serverUpdateInterval
            || this.buffer.size <= 1)
        {
            this.buffer.fill(this.queue, this.match.snapshot);
            this.lastServerUpdate = time;
        }
    }

}
