import * as SocketIO from 'socket.io-client'
import {
    Match,
    IMatchInitData,
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
        readonly lagCompensator: LagCompensationService,
        readonly loadService: LoadService,
        readonly soundService: SoundService,
        readonly recoveryService: GameRecoveryService
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
                                    this.soundService);
        }
        else
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
            return ;
        this.match.stopPointTitle();
        if (data.gameData.playerA.nick != this.match.nickA
            || data.gameData.playerB.nick != this.match.nickB
            || data.gameData.stage != this.match.stage
            || data.gameData.playerA.hero?.name != this.match.heroA
            || data.gameData.playerB.hero?.name != this.match.heroB)
        {
            this.destroy();
            this.init({
                role: data.role,
                matchData: data.gameData
            });
            this.preload();
            this.create();
            return ;
        }
        this.match.update(Match.initToData(data.gameData));
        this.queue = [];
        this.buffer?.empty();
    }

}
