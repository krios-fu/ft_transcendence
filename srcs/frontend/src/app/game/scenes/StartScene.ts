import * as SocketIO from 'socket.io-client';
import { IResultData } from '../elements/Result';
import { StartTitles } from '../elements/StartTitles';
import { GameRecoveryService } from '../services/recovery.service';
import { BaseScene } from './BaseScene';
import {
    GameScene,
    IMatchSceneInit,
    IMenuInit
} from '../interfaces/scene.interfaces';

export class    StartScene extends BaseScene {

    startTitles?: StartTitles;

    constructor(
        sock: SocketIO.Socket,
        private readonly recoveryService: GameRecoveryService
    ) {
        super("Start", sock);
    }

    init() {
        this.socket.once("newGame", (data: IMenuInit) => {
            this.destroy();
            if (data.selection.heroA != undefined)
                this.scene.start("MenuHero", data);
            else
                this.scene.start("Menu", data);
        });
        this.socket.once("startMatch", (data: IMatchSceneInit) => {
            let scene: GameScene = "Spectator";
        
            this.destroy();
            if (data.role != "Spectator")
                scene = data.matchData.playerA.hero ? "Player"
                                                            : "ClassicPlayer";            
            this.scene.start(scene, {
                role: data.role,
                matchData: data.matchData
            });
        });
        this.socket.once("end", (data: IResultData) => {
            this.destroy();
            this.scene.start("End", data);
        });
        this.recoveryService.setUp(this);
    }

    preload() {
        this.load.image('startBackground', '/assets/game_start_background.png');
    }

    create() {
        this.startTitles = new StartTitles(this);
    }

    destroy(): void {
        this.removeAllListeners();
        this.startTitles?.destroy();
    }

    recover(data: undefined): void {
        return ;
    }

}
