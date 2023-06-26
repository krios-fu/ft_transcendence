import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import {
    Observable,
    catchError,
    retry,
    throwError
} from "rxjs";
import { IUserRoom } from "src/app/interfaces/IUserRoom.interface";
import { AuthService } from "src/app/services/auth.service";

export type    RoomRole = "public" | "private";

export interface    IRoom {
    id: string;
    roomName: string;
    photoUrl: string;
    userCount: number;
}

export interface    IRoomUserCount {
    id: number;
    userCount: number;
}

@Injectable({
    providedIn: 'root'
})
export class    RoomListService {

    // Store common urls in separate file to avoid duplication
    private readonly _urlAuthority: string = "http://localhost:3000";
    private readonly _urlPathRoom: string = "/room";
    private readonly _urlPathRoomUserCount: string =
                            this._urlPathRoom + "/user_count";
    private readonly _urlPathUserRoom: string = "/user_room";

    constructor(
        private readonly httpService: HttpClient,
        private readonly authService: AuthService
    ) {}

    getRooms(roomRole: RoomRole, limit: number,
                offset: number): Observable<[IRoom[], number]> {
        return (
            this.httpService.get<[IRoom[], number]>(
                this._urlAuthority
                + this._urlPathRoom
                + `?filter[roomRole]=${roomRole}`
                + `&sort=roomId`
                + `&limit=${limit}`
                + `&offset=${offset}`
                + `&count=true`
            )
            .pipe(
                retry(3),
                catchError((err: any) => {
                    return throwError(() => err);
                })
            )
        );
    }

    getRoomUserCount(roomRole: RoomRole, limit: number,
                    offset: number): Observable<[IRoomUserCount[], number]> {
        return (
            this.httpService.get<[IRoomUserCount[], number]>(
                this._urlAuthority
                + this._urlPathRoomUserCount
                + `?roleName=${roomRole}`
                + `&order=id`
                + `&limit=${limit}`
                + `&offset=${offset}`
            )
            .pipe(
                catchError((err) => {
                    return throwError(() => err);
                })
            )
        );
    }

    isUserRegisteredInRoom(roomId: string): Observable<IUserRoom> {
        return (
            this.httpService.get<IUserRoom>(
                this._urlAuthority
                + this._urlPathUserRoom
                + '/users/'
                + this.authService.getAuthId()
                + '/rooms/'
                + roomId
            )
            .pipe(
                catchError((err) => {
                    return throwError(() => err);
                })
            )
        );
    }

    registerUserToRoom(userId: string, roomId: string,
                        password?: string): Observable<IUserRoom> {
        const   payload: any = password ?
                    {
                        userId: userId,
                        roomId: roomId,
                        password: password
                    } : {
                        userId: userId,
                        roomId: roomId,
                    };
    
        return (
            this.httpService.post<IUserRoom>(
                this._urlAuthority
                + this._urlPathUserRoom,
                payload
            )
            .pipe(
                catchError((err) => {
                    return throwError(() => err);
                })
            )
        );
    }

}
