import { Component, OnInit } from "@angular/core"
import * as Phaser from 'phaser'
import * as SockIO from 'socket.io-client'
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
    }

    ngOnInit(): void {
        //Create dto for data
        this.socket.once("role", (data: any) => { //PlayerA, PlayerB, Spectator
            if (data.role === "PlayerA")
            {
                this.config.scene = new PlayerAScene(
                                        this.socket, data.room, data.initData);
            }
            else if (data.role === "PlayerB")
            {
                this.config.scene = new PlayerBScene(
                                        this.socket, data.room, data.initData);
            }
            else if (data.role === "Spectator")
            {
                this.config.scene = new SpectatorScene(
                                        this.socket, data.room, data.initData);
            }
            // Add else to handle invalid data.role ?
            this.game = new Phaser.Game(this.config);
        })
    }
}
