import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import {
    Observable,
    catchError,
    retry,
    switchMap,
    throwError
} from "rxjs";
import { AuthService } from "src/app/services/auth.service";

export type    RoomRole = "public" | "private";

export interface    IRole {
    id: number;
}

export interface    IRoom {
    id: number;
    roomName: string;
    photoUrl: string;
    userCount: number;
}

export interface    IRoomRole {
    room: IRoom;
}

export interface    IRoomUserCount {
    id: number;
    userCount: number;
}

export interface    IUserRoom {
    userId: number;
}

@Injectable({
    providedIn: 'root'
})
export class    RoomListService {

    // Store common urls in separate file to avoid duplication
    private readonly _urlAuthority: string = "http://localhost:3000";
    private readonly _urlPathRoomRoles: string = "/room_roles";
    private readonly _urlPathRoles: string = "/roles";
    private readonly _urlPathRoomUserCount: string = "/room/user_count";
    private readonly _urlPathUserRoom: string = "/user_room"

    constructor(
        private readonly httpService: HttpClient,
        private readonly authService: AuthService
    ) {}

    private _getRoomRoles(roleId: number, limit: number,
                            offset: number): Observable<[IRoomRole[], number]> {
        return (
            this.httpService.get<[IRoomRole[], number]>(
                this._urlAuthority
                + this._urlPathRoomRoles
                + `?filter[roleId]=${roleId}`
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

    getRooms(roomRole: RoomRole, limit: number,
                offset: number): Observable<[IRoomRole[], number]> {
        return (
            this.httpService.get<IRole[]>(
                this._urlAuthority
                + this._urlPathRoles
                + `?filter[role]=${roomRole}`
            )
            .pipe(
                switchMap((roles: IRole[]) => {
                    if (!roles
                            || !roles.length)
                        return ([]);
                    return (this._getRoomRoles(roles[0].id, limit, offset));
                }),
                catchError((err) => {
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

    isUserRegisteredInRoom(roomId: number): Observable<IUserRoom> {
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

    registerUserToRoom(userId: string, roomId: number,
                        password?: string): Observable<IUserRoom> {
        return (
            this.httpService.post<IUserRoom>(
                this._urlAuthority
                + this._urlPathUserRoom,
                {
                    userId: userId,
                    roomId: roomId,
                    password: password || undefined
                }
            )
            .pipe(
                catchError((err) => {
                    return throwError(() => err);
                })
            )
        );
    }

}
