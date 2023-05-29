import * as SocketIO from 'socket.io-client'
import {
    Match,
    IMatchData
} from '../elements/Match';
import { SnapshotBuffer } from '../elements/SnapshotBuffer';
import { LagCompensationService } from '../services/lag-compensation.service';
import { LoadService } from '../services/load.service';
import {
    GameRecoveryService,
    IMatchRecoveryData
} from '../services/recovery.service';
import {
    MatchSoundKeys,
    SoundService
} from '../services/sound.service';
import { BaseScene } from './BaseScene';
import {
    GameScene,
    IMatchSceneInit
} from '../interfaces/scene.interfaces';

export class    MatchScene extends BaseScene {

    initData?: IMatchSceneInit;
    match?: Match;
    buffer?: SnapshotBuffer;
    queue: IMatchData[];
    lastServerUpdate: number;
    
    private _showInitCount: boolean = true;

    static readonly serverUpdateInterval = 50;

    constructor(
        scene: GameScene, socket: SocketIO.Socket,
        readonly lagCompensator: LagCompensationService,
        readonly loadService: LoadService,
        readonly soundService: SoundService,
        readonly recoveryService: GameRecoveryService
    ) {
        super(scene, socket);
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
            this.destroy();
            this.scene.start("End", data);
        });
        this.socket.on("matchUpdate", (snapshot: IMatchData) => {
            this.queue.push(snapshot);
        });
        this.recoveryService.setUp(this);
    }

    //Called after init()
    preload() {
        if (!this.initData)
            return ;
        this.loadService.match(this, this.initData.matchData);
    }

    //Called after preload()
    create() {
        if (!this.initData)
            return ;
        if (this.initData.recover)
            this._showInitCount = false;
        if (this.initData.matchData.stage != undefined
             && this.initData.matchData.playerA.hero
             && this.initData.matchData.playerB.hero)
        {
            this.soundService.load(this, {
                stage: SoundService.stageSoundKeysMap.get(
                    this.initData.matchData.stage
                ),
                heroA: SoundService.heroSoundKeysMap.get(
                    this.initData.matchData.playerA.hero.name
                ),
                heroB: SoundService.heroSoundKeysMap.get(
                    this.initData.matchData.playerB.hero.name
                ),
                collision: SoundService.matchOtherSoundKeys.collision,
                point: SoundService.matchOtherSoundKeys.point
            } as MatchSoundKeys);
            this.match = new Match(this, this.initData.matchData,
                                    this._showInitCount,
                                    this.soundService);
        }
        else
            this.match = new Match(this, this.initData.matchData,
                                    this._showInitCount);
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

    destroy(): void {
        this.removeAllListeners();
        this.match?.destroy();
        this.buffer = undefined;
        this.soundService.destroy();
    }

    recover(data: IMatchRecoveryData): void {
        if (!this.match)
        {
            this.initData = {
                role: data.role,
                matchData: data.matchData,
                recover: true
            }
            return ;
        }
        this.match.stopPointTitle();
        if (data.matchData.playerA.nick != this.match.nickA
            || data.matchData.playerB.nick != this.match.nickB
            || data.matchData.stage != this.match.stage
            || data.matchData.playerA.hero?.name != this.match.heroA
            || data.matchData.playerB.hero?.name != this.match.heroB)
        {
            this.destroy();
            this.init({
                role: data.role,
                matchData: data.matchData
            });
            this.preload();
            this.create();
            return ;
        }
        this.match.update(Match.initToData(data.matchData));
        this.queue = [];
        this.buffer?.empty();
    }

}
