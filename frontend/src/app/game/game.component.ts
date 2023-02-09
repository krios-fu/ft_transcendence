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
import { LoadService } from "./services/load.service";
import { SocketService } from "./services/socket.service";
import { SoundService } from "./services/sound.service";

@Component({
    selector: 'app-game',
    templateUrl: './game.component.html',
    styleUrls: ['./game.component.scss']
})
export class    GameComponent implements OnInit {

    private config: Phaser.Types.Core.GameConfig;
    private socket: SockIO.Socket;
    private game?: Phaser.Game;

    constructor (
        private readonly socketService: SocketService,
        private readonly lagCompensator: LagCompensationService,
        private readonly loadService: LoadService,
        private readonly soundService: SoundService
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
            fps: {
                min: 60
            },
            render: {
                powerPreference: "high-performance"
            },
            scene: undefined // Will be assigned afterwards
        };
        this.socket = this.socketService.socket;
    }

    ngOnInit(): void {
        const   startScene: StartScene =
                    new StartScene(this.socket, "Game1");
        const   menuScene: MenuScene =
                    new MenuScene(this.socket, "Game1");
        const   menuHeroScene: MenuHeroScene =
                    new MenuHeroScene(this.socket, "Game1", this.soundService);
        const   playerScene: PlayerScene =
                    new PlayerScene(this.socket, "Game1", this.lagCompensator,
                                        this.loadService, this.soundService);
        const   classicPlayerScene: ClassicPlayerScene =
                    new ClassicPlayerScene(this.socket, "Game1",
                                        this.lagCompensator, this.loadService,
                                        this.soundService);
        const   spectatorScene: SpectatorScene =
                    new SpectatorScene(this.socket, "Game1", this.lagCompensator,
                                        this.loadService, this.soundService);
        const   endScene: EndScene =
                    new EndScene(this.socket, "Game1");
            
        this.config.scene = [
            startScene, menuScene, menuHeroScene, playerScene,
            classicPlayerScene, spectatorScene, endScene
        ];
        this.game = new Phaser.Game(this.config);
    }

}
