import { Injectable, OnInit } from "@angular/core";
import { Socket } from "ngx-socket-io";
import { AlertServices } from 'src/app/services/alert.service';
import { UserDto } from "../dtos/user.dto";
import { UsersService } from "./users.service";
import { Router } from '@angular/router';
import { IRoomData, RoomCreationFormService } from "../game/room-creation-form/room-creation-form.service";
import { RoomListService } from "../game/room-list/room-list.service";


@Injectable()
export class SocketNotificationService implements OnInit {

    me?: UserDto;
    constructor(private socket: Socket,
        private alertService: AlertServices,
        private userServices: UsersService,
        private readonly router: Router,
        private readonly roomCreationFormService: RoomCreationFormService,
        private readonly roomListService: RoomListService ) {

        this.userServices.getUser('me')
            .subscribe({
                next: (me: UserDto) => {
                    this.joinRoomNotification(me.username)
                    socket.fromEvent('notifications')
                        .subscribe({
                            next: (payload: any) => {
                                if (payload.title == 'ACCEPTED GAME'){
                                    this.roomListService.registerUserToRoom(
                                        me.username,
                                        payload.room,
                                    )
                                    .subscribe({
                                        next: () => {
                                            this.router.navigate(['/game', payload.room]);
                                        }})
                                }
                                if (payload.title == 'DECLINING INVITATION'){
                                    this.alertService.openSnackBar(payload.user.nickName + ' DECLINING INVITATION','OK');
                                }
                                if (payload.title == 'INVITE GAME')
                                    this.alertService.openRequestGame(payload.user as UserDto, payload.title)
                                        .subscribe({
                                            next: (data: boolean) => {
                                                if (data){
                                                    this._postRoom(this.generateName())
                                                    .subscribe({
                                                        next: (roomData: IRoomData) => {
                                                            this.sendNotification({
                                                                user: me,
                                                                dest: payload.user.username,
                                                                room: roomData.id,
                                                                title: 'ACCEPTED GAME'
                                                            });
                                                            this.router.navigate(['/game', roomData.id]);
                                                        },
                                                        error: (err: any) => {
                                                            console.error(err);
                                                            this._errorHandler(err);
                                                        }
                                                    });
                                                }
                                                else{
                                                    this.sendNotification({
                                                        user: me,
                                                        dest: payload.user.username,
                                                        // room: roomData.id,
                                                        title: 'DECLINING INVITATION'
                                                    });
                                                }
                                            }
                                        })
                            }
                        })
                }
            })
    }

    generateName() : string {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const nameLength = Math.floor(Math.random() * 7) + 4; // Genera una longitud aleatoria entre 4 y 7
        let name = '';
    
        for (let i = 0; i < nameLength; i++) {
          const randomIndex = Math.floor(Math.random() * characters.length);
          name += characters[randomIndex];
        }
    
        return name;
      }

    private _errorHandler(err: any): void {
        let errorMsg: string;
    
        if (err.error
                && err.error.message)
            errorMsg = err.error.message;
        else
            errorMsg = "Room creation failed, try again later.";
        this.alertService.openSnackBar(errorMsg, "OK");
    }

    private _postRoom(roomName: string, password?: string) {
        return this.roomCreationFormService.postRoom(
            roomName,
            password
        )
        
    }

    ngOnInit(): void {
    }


    joinRoomNotification(username: string) {
        this.socket.emit('join_room_notification', username);
    }
    sendNotification(payload: any) {
        this.socket.emit(`notifications`, payload)
    }

    joinRoomId(_room: string, _user: UserDto) {
        this.socket.emit('join_room_game', { room: _room, user: _user });
    }

    roomLeave(_room?: string, _user?: UserDto, is_leave?: boolean, kicker ?: string ) {
        this.socket.emit('room_leave', { room: _room, user: _user,  leave: is_leave, kicker: kicker });
    }

    // roomAdmin(_room?: string, _user?: UserDto) {
    //     this.socket.emit('room_admin', { room: _room, user: _user });
    // }

    sendConnetionRoomGameId(_room: string, _user: UserDto) {
        this.socket.emit(`noti_game_room`, { room: _room, user: _user })
    }

    getUserAll(userName: string) {
        return this.socket.fromEvent(userName);
    }

   getUserConnection() {
        return this.socket.fromEvent('noti_game_room');
    }

    userLeave() {
        return this.socket.fromEvent('room_leave');
    }

    playerUpdate(){
        return this.socket.fromEvent('player_update');
    }

    playerUpdateEmit(_room: string, _user: UserDto ) {
        this.socket.emit('player_update', { room: _room, user: _user });
    }

    // get_room_admin() {
    //     return this.socket.fromEvent('room_admin');
    // }

}