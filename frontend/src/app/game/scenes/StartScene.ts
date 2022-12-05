import * as SocketIO from 'socket.io-client'
import { IMatchInitData } from '../elements/Match';
import { StartTitles } from '../elements/StartTitles';
import { Txt } from '../elements/Txt';
import { BaseScene } from './BaseScene'
import { IMenuInit } from './MenuScene';

export class    StartScene extends BaseScene {

    startTitles?: StartTitles;

    constructor(
        sock: SocketIO.Socket, room: string
    ) {
        super("Start", sock, room);
    }

    init() {
        this.socket.once("newGame", (data: IMenuInit) => {
            this.startTitles?.destroy();
            this.removeAllSocketListeners();
            if (data.hero)
                this.scene.start("MenuHero", data);
            else
                this.scene.start("Menu", data);
        });
        this.socket.once("startMatch", (gameData: IMatchInitData) => {
            this.startTitles?.destroy();
            this.removeAllSocketListeners();
            this.scene.start("Spectator", gameData);
        });
        this.socket.once("end", (data: any) => {
            this.startTitles?.destroy();
            this.removeAllSocketListeners();
            this.scene.start("End", data);
        });
    }

    preload() {
        this.load.image('startBackground', '/assets/game_start_background.png');
    }

    create() {
        this.startTitles = new StartTitles(this);
    }
}
