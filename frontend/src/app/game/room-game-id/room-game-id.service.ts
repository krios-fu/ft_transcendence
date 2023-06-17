import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import {
    Observable,
    catchError,
    retry,
    throwError
} from "rxjs";
import { IUserRoom } from "src/app/interfaces/IUserRoom.interface";
import { environment } from 'src/environments/environment';


@Injectable({
    providedIn: 'root'
})
export class    RoomGameIdService {

    // Store common urls in separate file to avoid duplication
    // private readonly _urlAuthority: string = "http://localhost:3000";
    // private readonly _urlPathUserRoom: string = "/user_room";

    constructor(
        private readonly httpService: HttpClient
    ) {}

    getUserInRoom(userId: string, roomId: string): Observable<IUserRoom> {
        return (
            this.httpService.get<IUserRoom>(
                `${environment.apiUrl}user_room/users/${userId}/rooms/${roomId}`
            )
            .pipe(
                retry(3),
                catchError((err) => {
                    return throwError(() => err);
                })
            )
        );
    }

}
