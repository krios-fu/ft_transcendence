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


@Injectable({
    providedIn: 'root'
})
export class    RoomGameIdService {

    private readonly _pathUserRoom: string = "user_room/";

    constructor(
        private readonly httpService: HttpClient
    ) {}

    getUserInRoom(userId: string | number, roomId: string): Observable<IUserRoom> {
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

    unregisterFromRoom(userId: string | number, roomId: string): Observable<void> {
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

}
