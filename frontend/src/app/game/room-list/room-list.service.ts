import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import {
    Observable,
    catchError,
    retry,
    switchMap,
    throwError
} from "rxjs";

export type    RoomRole = "public" | "private";

export interface    IRole {
    id: number;
}

export interface    IRoom {
    id: number;
    roomName: string;
    photoUrl: string;
}

export interface    IRoomRole {
    room: IRoom;
}

@Injectable({
    providedIn: 'root'
})
export class    RoomListService {

    // Store common urls in separate file to avoid duplication
    private readonly _urlAuthority: string = "http://localhost:3000";
    private readonly _urlPathRoomRoles: string = "/room_roles";
    private readonly _urlPathRoles: string = "/roles";

    constructor(
        private readonly httpService: HttpClient
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

}
