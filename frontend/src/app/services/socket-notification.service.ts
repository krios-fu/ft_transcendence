import { Injectable, OnInit } from "@angular/core";
import { Socket } from "ngx-socket-io";
import { AlertServices } from 'src/app/services/alert.service';
import { UserDto } from "../dtos/user.dto";

@Injectable()
export class SocketNotificationService implements OnInit {

    constructor(private socket: Socket,
        private alertService: AlertServices) {

        socket.fromEvent('notifications')
            .subscribe((payload: any) => {
                console.log(payload)
                this.alertService.openRequestGame(payload.user as UserDto, payload.title);
            })

     
    }

    ngOnInit(): void {
    }


    joinRoomNotification(username: string) {
        this.socket.emit('join_room_notification', username);
    }
    sendNotification(payload: any) {
        console.log("SEND NOTIFICATION", `notifications_${payload.dest}`, payload.title);
        this.socket.emit(`notifications`, payload)
    }

    joinRoomId(_room: string, _user: UserDto){
        this.socket.emit('join_room_game', {room: _room, user: _user});
    }

    roomLeave(_room?: string, _user?: UserDto){
        this.socket.emit('room_leave', {room: _room, user: _user});
    }

    sendConnetionRoomGameId(_room: string, _user: UserDto) {
        this.socket.emit(`noti_game_room`, {room: _room, user: _user})
    }

    getUserAll(userName: string){
        return this.socket.fromEvent(userName);
    }

    getUserConnection(){
        return this.socket.fromEvent('noti_game_room');
    }

    userLeave(){
        return this.socket.fromEvent('room_leave');
    }

}