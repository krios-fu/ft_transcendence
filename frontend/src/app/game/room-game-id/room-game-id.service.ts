import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import {
    Observable,
    catchError,
    retry,
    switchMap,
    throwError
} from "rxjs";
import { IUserRoom } from "src/app/interfaces/IUserRoom.interface";
import { environment } from 'src/environments/environment';

export interface    IRoomRole {
    id: number;
}

@Injectable({
    providedIn: 'root'
})
export class    RoomGameIdService {

    private readonly _pathUserRoom: string = "user_room/";
    private readonly _pathRoomRoles: string = "room_roles/";

    constructor(
        private readonly httpService: HttpClient
    ) {}

    getUserInRoom(userId: string | number, roomId?: string ): Observable<IUserRoom> {
        return (
            this.httpService.get<IUserRoom>(
                `${environment.apiUrl}${this._pathUserRoom}`
                + `users/${userId}/rooms/${roomId}`
            )
            .pipe(
                retry(3),
                catchError((err) => {
                    return throwError(() => err);
                })
            )
        );
    }


    private _unregisterCall(userRoomId: number): Observable<void> {
        return (
            this.httpService.delete<void>(
                `${environment.apiUrl}${this._pathUserRoom}${userRoomId}`
            )
            .pipe(
                retry(3),
                catchError((err) => {
                    return throwError(() => err);
                })
            )
        );
    }

    unregisterFromRoom(userId: string | number, roomId ?: string ): Observable<void> {
        return (
            this.getUserInRoom(userId, roomId)
            .pipe(
                switchMap((userRoom: IUserRoom) => {
                    if (!userRoom)
                        return (throwError(() => "Not registered in room"));
                    return (this._unregisterCall(userRoom.id))
                }),
                catchError((err) => {
                    return (throwError(() => err));
                })
            )
        )
    }

    changePassword(roomId: string, oldPassword: string,
                    newPassword: string): Observable<IRoomRole> {
        return (
            this.httpService.put<IRoomRole>(
                `${environment.apiUrl}${this._pathRoomRoles}`
                + `room/${roomId}/password`,
                {
                    oldPassword: oldPassword,
                    newPassword: newPassword
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
