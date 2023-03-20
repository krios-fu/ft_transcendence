import * as SocketIO from 'socket.io-client'
import { IMatchInitData } from '../elements/Match';
import { IResultData } from '../elements/Result';
import { StartTitles } from '../elements/StartTitles';
import { GameRecoveryService } from '../services/recovery.service';
import { BaseScene } from './BaseScene'
import { IMenuInit } from './MenuScene';

export class    StartScene extends BaseScene {

    startTitles?: StartTitles;

    constructor(
        sock: SocketIO.Socket, room: string,
        private readonly recoveryService: GameRecoveryService
    ) {
        super("Start", sock, room);
    }

    init() {
        this.socket.once("newGame", (data: IMenuInit) => {
            this.destroy();
            if (data.selection.heroA != undefined)
                this.scene.start("MenuHero", data);
            else
                this.scene.start("Menu", data);
        });
        this.socket.once("startMatch", (gameData: IMatchInitData) => {
            this.destroy();
            this.scene.start("Spectator", {
                role: "Spectator",
                matchData: gameData
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
