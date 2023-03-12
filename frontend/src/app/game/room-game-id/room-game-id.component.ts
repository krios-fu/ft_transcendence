import { Component, OnInit } from "@angular/core"
import * as Phaser from 'phaser'
import * as SockIO from 'socket.io-client'
import { ClassicPlayerScene } from "../scenes/ClassicPlayerScene";
import { EndScene } from "../scenes/EndScene";
import { MenuHeroScene } from "../scenes/MenuHeroScene";
import { MenuScene } from "../scenes/MenuScene";
import { PlayerScene } from "../scenes/PlayerScene";
import { SpectatorScene } from "../scenes/SpectatorScene";
import { StartScene } from "../scenes/StartScene";
import { LagCompensationService } from "../services/lag-compensation.service";
import { LoadService } from "../services/load.service";
import { SocketService } from "../services/socket.service";
import { GameRecoveryService } from "../services/recovery.service";
import { SoundService } from "../services/sound.service";
import { ActivatedRoute } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { UserDto } from "src/app/dtos/user.dto";
import { FormControl, FormGroup } from "@angular/forms";
import { RoomDto } from "src/app/dtos/room.dto";
import { SocketNotificationService } from "src/app/services/socket-notification.service";
import { UsersService } from "src/app/services/users.service";

@Component({
  selector: 'app-room-game-id',
  templateUrl: './room-game-id.component.html',
  styleUrls: ['./room-game-id.component.scss']
})
export class RoomGameIdComponent implements OnInit {
    private config: Phaser.Types.Core.GameConfig;
    private socket: SockIO.Socket;
    private game?: Phaser.Game;
    me ?: UserDto;
    user?: UserDto;
    room_id?: string;
    room_dto? : RoomDto;
    public formMessage = new FormGroup({
        message: new FormControl('')
      })


    constructor (
        private readonly socketService: SocketService,
        private readonly lagCompensator: LagCompensationService,
        private readonly loadService: LoadService,
        private readonly soundService: SoundService,
        private readonly recoveryService: GameRecoveryService,
        private gameServiceNoti: SocketNotificationService,
        private userService: UsersService,
        private route: ActivatedRoute,
        private http: HttpClient
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

        this.route.params.subscribe(({ id }) => {
            this.formMessage.patchValue({ id });
            this.room_id = id;
            delete this.room_dto;
            this.http.get<RoomDto>(`http://localhost:3000/room/${this.room_id}`)
              .subscribe((entity) => {
                  this.room_dto = entity;
                  console.log(`ROOM_ID: ${this.room_id}`,this.room_dto);
              });

              this.userService.getUser('me')
              .subscribe((users : UserDto[]) => {
                this.me = users[0];
              })
          });


        const   startScene: StartScene =
                    new StartScene(this.socket, "Game1", this.recoveryService);
        const   menuScene: MenuScene =
                    new MenuScene(this.socket, "Game1", this.recoveryService);
        const   menuHeroScene: MenuHeroScene =
                    new MenuHeroScene(this.socket, "Game1",
                                        this.soundService,
                                        this.recoveryService);
        const   playerScene: PlayerScene =
                    new PlayerScene(this.socket, "Game1",
                                        this.lagCompensator,
                                        this.loadService,
                                        this.soundService,
                                        this.recoveryService);
        const   classicPlayerScene: ClassicPlayerScene =
                    new ClassicPlayerScene(this.socket, "Game1",
                                        this.lagCompensator,
                                        this.loadService,
                                        this.soundService,
                                        this.recoveryService);
        const   spectatorScene: SpectatorScene =
                    new SpectatorScene(this.socket, "Game1",
                                        this.lagCompensator,
                                        this.loadService,
                                        this.soundService,
                                        this.recoveryService);
        const   endScene: EndScene =
                    new EndScene(this.socket, "Game1", this.recoveryService);
            
        this.config.scene = [
            startScene, menuScene, menuHeroScene, playerScene,
            classicPlayerScene, spectatorScene, endScene
        ];
        this.game = new Phaser.Game(this.config);
    }

    leaveRoom(){
        this.gameServiceNoti.roomLeave(this.room_id, this.me);
    }

}