import { Component, OnInit } from "@angular/core"
import * as Phaser from 'phaser'
import * as SockIO from 'socket.io-client'
import { EndScene } from "./scenes/EndScene";
import { PlayerAScene } from "./scenes/PlayerAScene";
import { PlayerBScene } from "./scenes/PlayerBScene";
import { SpectatorScene } from "./scenes/SpectatorScene";

@Component({
    selector: 'app-game',
    templateUrl: './game.component.html',
    styleUrls: ['./game.component.css']
})
export class    GameComponent implements OnInit {

    private config: Phaser.Types.Core.GameConfig;
    private socket: SockIO.Socket;
    private game?: Phaser.Game;
    private queueButtonClick: boolean;
    private username?: string; //Provisional

    constructor () {
        this.config = {
            type: Phaser.AUTO, //WEBGL if available. Canvas otherwise.
            parent: 'game_zone',
            width: 800,
            height: 600,
            /*scale: {
                mode: Phaser.Scale.WIDTH_CONTROLS_HEIGHT ,
                autoCenter: Phaser.Scale.CENTER_BOTH
            },*/
            scene: undefined // Will be assigned afterwards
        };
        this.socket = SockIO.io("ws://localhost:3001");
        this.queueButtonClick = false;
        this.socket.once("mockUser", (data: any) => {
            this.username = data.mockUser;
        }); //Provisional
    }

    ngOnInit(): void {
        let playerAScene: PlayerAScene;
        let playerBScene: PlayerBScene;
        let spectatorScene: SpectatorScene;
        let endScene: EndScene;

        //Create dto for data
        this.socket.once("init", (data: any) => {
            playerAScene =
                new PlayerAScene(this.socket, "Game1", data.initData);
            playerBScene =
                new PlayerBScene(this.socket, "Game1", data.initData);
            spectatorScene =
                new SpectatorScene(this.socket, "Game1", data.initData);
            endScene = 
                new EndScene(this.socket, "Game1", data.initData);
            this.config.scene = [
                spectatorScene, playerAScene, playerBScene, endScene
            ];
            this.game = new Phaser.Game(this.config);
        })
    }

    addToQueue() {
        /*if (this.queueButtonClick)
            return ;*/
        this.socket.emit("addToGameQueue", {
            gameId: "Game1",
            username: this.username
        });
        this.queueButtonClick = true;
    }
}
