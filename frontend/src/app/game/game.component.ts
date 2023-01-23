import { Component, OnInit } from "@angular/core"
import * as Phaser from 'phaser'
import * as SockIO from 'socket.io-client'
import { ClassicPlayerScene } from "./scenes/ClassicPlayerScene";
import { EndScene } from "./scenes/EndScene";
import { MenuHeroScene } from "./scenes/MenuHeroScene";
import { MenuScene } from "./scenes/MenuScene";
import { PlayerScene } from "./scenes/PlayerScene";
import { SpectatorScene } from "./scenes/SpectatorScene";
import { StartScene } from "./scenes/StartScene";
import { LagCompensationService } from "./services/lag-compensation.service";

@Component({
    selector: 'app-game',
    templateUrl: './game.component.html',
    styleUrls: ['./game.component.scss']
})
export class    GameComponent implements OnInit {

    private config: Phaser.Types.Core.GameConfig;
    private socket: SockIO.Socket;
    private game?: Phaser.Game;
    private queueButtonClick: boolean;
    private username?: string; //Provisional

    constructor (
        private readonly lagCompensator: LagCompensationService
    ) {
        this.config = {
            type: Phaser.CANVAS,
            parent: 'game_zone',
            width: 800,
            height: 600,
            scale: {
                mode: Phaser.Scale.WIDTH_CONTROLS_HEIGHT ,
                autoCenter: Phaser.Scale.CENTER_BOTH
            },
            scene: undefined // Will be assigned afterwards
        };
        this.socket = SockIO.io("ws://localhost:3001");
        this.queueButtonClick = false;
        this.socket.once("mockUser", (data: any) => {
            this.username = data.mockUser;
        }); //Provisional
    }

    ngOnInit(): void {
        const   startScene: StartScene =
                    new StartScene(this.socket, "Game1");
        const   menuScene: MenuScene =
                    new MenuScene(this.socket, "Game1");
        const   menuHeroScene: MenuHeroScene =
                    new MenuHeroScene(this.socket, "Game1");
        const   playerScene: PlayerScene =
                    new PlayerScene(this.socket, "Game1",
                                        this.lagCompensator);
        const   classicPlayerScene: ClassicPlayerScene =
                    new ClassicPlayerScene(this.socket, "Game1",
                                        this.lagCompensator);
        const   spectatorScene: SpectatorScene =
                    new SpectatorScene(this.socket, "Game1",
                                        this.lagCompensator);
        const   endScene: EndScene =
                    new EndScene(this.socket, "Game1");
            
        this.config.scene = [
            startScene, menuScene, menuHeroScene, playerScene,
            classicPlayerScene, spectatorScene, endScene
        ];
        this.game = new Phaser.Game(this.config);
    }

    addToQueue() {
        /*if (this.queueButtonClick)
            return ;*/
        this.socket.emit("addToGameQueue", {
            room: "Game1",
            username: this.username
        });
        this.queueButtonClick = true;
    }

    addToHeroQueue() {
        /*if (this.queueButtonClick)
            return ;*/
        this.socket.emit("addToGameHeroQueue", {
            room: "Game1",
            username: this.username
        });
        this.queueButtonClick = true;
    }

}
