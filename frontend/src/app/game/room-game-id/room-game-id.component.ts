import { Component, HostListener, OnDestroy, OnInit } from "@angular/core"
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
import {
    ActivatedRoute,
    Router
} from "@angular/router";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { UserDto } from "src/app/dtos/user.dto";
import { FormControl, FormGroup } from "@angular/forms";
import { RoomDto } from "src/app/dtos/room.dto";
import { SocketNotificationService } from "src/app/services/socket-notification.service";
import { UsersService } from "src/app/services/users.service";
import { Subscription } from "rxjs";
import { BaseScene } from "../scenes/BaseScene";
import {
    IRoomRole,
    RoomGameIdService
} from "./room-game-id.service";
import { IUserRoom } from "src/app/interfaces/IUserRoom.interface";
import { AuthService } from "src/app/services/auth.service";
import { environment } from 'src/environments/environment';
import { AlertServices } from "../../services/alert.service";
import { IPasswordChange } from "../../services/dialog/input/change_room_password/change-room-password-input.component";
import { Roles } from "src/app/roles";
import { Metropolis } from "../elements/Metropolis";

@Component({
    selector: 'app-room-game-id',
    templateUrl: './room-game-id.component.html',
    styleUrls: ['./room-game-id.component.scss']
})
export class RoomGameIdComponent implements OnInit, OnDestroy {
    private readonly config: Phaser.Types.Core.GameConfig;
    private socket: SockIO.Socket;
    private scenes?: BaseScene[];
    private game?: Phaser.Game;
    private routeParamsSubscription?: Subscription;
    me?: UserDto;
    user?: UserDto;
    room_id: string;
    room_dto?: RoomDto;
    close = false;
    roles = {
        official: false,
        private: false,
    };

    colors = {
        atlantis: '#7fffd4',
        metropolis: '#ff0000',
        wakanda: '#a87fff',
    };

    color = '#ffffff';

    urlPreview = 'https://www.pngall.com/wp-content/uploads/2016/05/Ping-Pong-Download-PNG.png'
    public formMessage = new FormGroup({
        message: new FormControl('')
    })

    // photoUrl = 'https://www.pngall.com/wp-content/uploads/2016/05/Ping-Pong-Download-PNG.png'




    constructor(
        private readonly socketService: SocketService,
        private readonly lagCompensator: LagCompensationService,
        private readonly loadService: LoadService,
        private readonly soundService: SoundService,
        private readonly recoveryService: GameRecoveryService,
        private gameServiceNoti: SocketNotificationService,
        private userService: UsersService,
        private route: ActivatedRoute,
        private http: HttpClient,
        private readonly router: Router,
        private readonly authService: AuthService,
        private readonly roomGameIdService: RoomGameIdService,
        private readonly alertService: AlertServices,
    ) {

        this.config = {
            type: Phaser.CANVAS,
            parent: 'game_zone',
            width: 800,
            height: 600,
            scale: {
                mode: Phaser.Scale.WIDTH_CONTROLS_HEIGHT,
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
        this.room_id = this.route.snapshot.params['id'];
    }

    private _initRoomConnection(roomId: string): void {
        if (this.room_id != roomId)
            this.socketService.emit<string>("leaveRoom", this.room_id);
        this.socketService.joinRoom(roomId);
    }

    private _initOps(roomId: string): void {
        this._initRoomConnection(roomId); //Call before reassigning this.room_id
        this.room_id = roomId;
        this._initGame(roomId);
        delete this.room_dto;
        this.http.get<RoomDto>(`${environment.apiUrl}room/${this.room_id}`)
            .subscribe((entity) => {
                this.room_dto = entity;
                if (this.room_dto?.photoUrl)
                    this.urlPreview = environment.staticUrl + this.room_dto?.photoUrl as string;
                if (this.room_dto?.roomName.toLowerCase() === 'metropolis')
                    this.color = this.colors.metropolis;
                if (this.room_dto?.roomName.toLowerCase() === 'wakanda')
                    this.color = this.colors.wakanda;
                if (this.room_dto?.roomName.toLowerCase() === 'atlantis')
                    this.color = this.colors.atlantis;
            });
        this.userService.getUser('me')
            .subscribe((users: UserDto) => {
                this.me = users;
            })
    }

    private _redirectToRoomLists(): void {
        this.router.navigate(['/game']);
    }

    private _checkUserInRoom(roomId: string): void {
        const userId: string | null = this.authService.getAuthId();

        if (!userId) {
            this.router.navigateByUrl("/login");
            return;
        }
        this.roomGameIdService.getUserInRoom(userId, roomId)
            .subscribe({
                next: (userRoom: IUserRoom) => {
                    if (userRoom)
                        this._initOps(roomId);
                    else
                        this._redirectToRoomLists();
                },
                error: (err: any) => {
                    console.error(err);
                    this._redirectToRoomLists();
                }
            });
    }

    ngOnInit(): void {
        this.routeParamsSubscription = this.route.params.subscribe(({ id }) => {
            this.formMessage.patchValue({ id });
            this._checkUserInRoom(id);
            this.get_roles_room();
        });
        this.socketService.bannedRoomEvent();
    }

    info(): void {
        this.alertService.openGameInstructions();
    }

    // Returns the HTMLCanvasElement that is created by Phaser.
    private _getGameCanvas(): HTMLCanvasElement | undefined {
        const canvas: HTMLCanvasElement | null =
            document.querySelector("canvas");

        return (canvas ? canvas : undefined);
    }

    // Mainly to remove the socket instance's event listeners
    private _destroyScenes(scenes: BaseScene[] | undefined): void {
        if (!scenes)
            return;
        for (const scene of scenes) {
            scene.destroy();
        }
    }

    /*
    **  On reconnection, this.socket's event listeners are still valid,
    **  so no socket disconnection handling is necessary.
    **
    **  No need to explicitly remove game event listeners on destroy,
    **  because they are associated to game instances.
    */
    private _initGame(roomId: string): void {
        if (this.game) {
            this._destroyScenes(this.scenes);
            this.game.destroy(false, false);
            this.config.canvas = this._getGameCanvas();
        }
        this.scenes = [
            new StartScene(this.socket, this.recoveryService),
            new MenuScene(this.socket, this.recoveryService),
            new MenuHeroScene(this.socket, this.soundService,
                this.recoveryService),
            new PlayerScene(this.socket, this.lagCompensator,
                this.loadService, this.soundService,
                this.recoveryService),
            new ClassicPlayerScene(this.socket, this.lagCompensator,
                this.loadService, this.soundService,
                this.recoveryService),
            new SpectatorScene(this.socket, this.lagCompensator,
                this.loadService, this.soundService,
                this.recoveryService),
            new EndScene(this.socket, this.recoveryService)
        ];
        this.config.scene = this.scenes;
        this.game = new Phaser.Game(this.config);
        this.game.events.on("visible", () => {
            this.socket.emit("recover", roomId);
        });
    }

    /*'leaveRoom' event is emitted at ngOnDestroy when user is redirected.*/
    leaveRoom() {
        const userId: string | null = this.authService.getAuthId();

        if (!userId) {
            this.router.navigateByUrl("/login");
            return;
        }
        this.gameServiceNoti.roomLeave(this.room_id, this.me);
        this.roomGameIdService.unregisterFromRoom(userId, this.room_id)
            .subscribe({
                next: () => {
                    this._redirectToRoomLists();
                },
                error: (err: any) => {
                    let errorMsg: string;

                    if (err.error
                        && err.error.message)
                        errorMsg = err.error.message;
                    else
                        errorMsg = "Cannot unregister owner"
                            + " from non-empty room.";
                    this.alertService.openSnackBar(errorMsg, "Ok");
                    this._redirectToRoomLists();
                }
            });
    }


    onFile(event: any) {

        let file = event.target.files[0];

        const formData = new FormData();

        formData.append("avatar", file);

        this.http.post<RoomDto>(`${environment.apiUrl}room/${this.room_id}/avatar`, formData)
            .subscribe(
                (data: RoomDto) => {
                    this.room_dto = data;

                    const reader = new FileReader();
                    reader.onload = () => {
                        this.urlPreview = reader.result as string;
                    }
                    reader.readAsDataURL(file as any);
                });
    }

    change_name(value: string) {
        const name = value.trim();
        if (value === this.room_dto?.roomName)
            this.edit()
        else if (name.length < 3 || name.length > 8) {
            this.alertService.openSnackBar('NAME ROOM INVALID', 'OK');
            this.edit()
        }
        else {
            let form = new FormData();
            this.http.put<RoomDto>(`${environment.apiUrl}room/${this.room_id}`, { ...form, roomName: name })
                .subscribe((data: RoomDto) => {
                    this.edit()
                    this.room_dto = data
                })
        }
    }

    changePassword(): void {
        this.alertService.openChangeRoomPassword()
            .subscribe({
                next: (passData: IPasswordChange) => {
                    if (passData) {
                        this.roomGameIdService.changePassword(
                            this.room_id,
                            passData.oldPassword,
                            passData.newPassword
                        )
                            .subscribe({
                                next: (roomRole: IRoomRole) => {
                                    if (roomRole) {
                                        this.alertService.openSnackBar(
                                            "Password updated successfully",
                                            "Ok"
                                        );
                                    }
                                },
                                error: (err: HttpErrorResponse) => {
                                    let errorMsg: string;
                                    if (err.error && err.error.statusCode === 400)
                                        errorMsg = "Provided invalid password/s";
                                    else if (err.error && err.error.statusCode === 403)
                                        errorMsg = "Old password is wrong";
                                    else
                                        errorMsg = "Password could not be changed";
                                    this.alertService.openSnackBar(errorMsg, "Ok");
                                }
                            });
                    }
                }
            });
    }

    edit() {
        this.close = !this.close;
    }

    get_roles_room() {
        this.http.get(`${environment.apiUrl}room_roles/rooms/${this.room_id}`)
            .subscribe((data: any) => {
                let room_roles = Object.assign(data);
                room_roles.forEach((room_role: any) => {

                    if (room_role.role === "official") {
                        this.roles.official = true;
                    }
                    if (room_role.role === 'private') {
                        this.roles.private = true;
                    }
                });
            });
    }

    @HostListener('window:keyup.control.shift.i', ['$event'])
    handleKeyDown() {
        this.alertService.openGameInstructions();
    }

    ngOnDestroy(): void {
        this.socketService.emit<string>("leaveRoom", this.room_id);
        this.routeParamsSubscription?.unsubscribe();
        this._destroyScenes(this.scenes);
        this.game?.destroy(true, false);
        this.socketService.unsubscribeFromEvent('banned_room');
    }

}
