import {
    HttpClient,
    HttpErrorResponse
} from "@angular/common/http";
import { Injectable } from "@angular/core";
import {
    Observable,
    catchError,
    retry,
    throwError
} from "rxjs";

export interface    ICreateRoom {
    roomName: string;
    password?: string;
}

export interface    IRoomData {
    id: number;
    roomName: string;
}

@Injectable({
    providedIn: "root"
})
export class   RoomCreationFormService {

    private readonly _urlAuthority: string = "http://localhost:3000";
    private readonly _path: string = "/room";
    private readonly _pathPrivate: string = this._path + '/private';


    constructor(
        private readonly httpService: HttpClient
    ) {}

    private _httpErrorHandler(err: HttpErrorResponse): Observable<never> {
        return (throwError(() => err));
    }

    _postRoom(roomData: ICreateRoom): Observable<IRoomData> {
        const   path: string = roomData.password ? this._pathPrivate
                                                    : this._path;
    
        return (
            this.httpService.post<IRoomData>(
                this._urlAuthority + path,
                roomData
            )
            .pipe(
                retry(1),
                catchError(this._httpErrorHandler)
            )
        );
    }

    postRoom(roomName: string, password?: string): Observable<IRoomData> {
        return (
            this._postRoom({
                roomName: roomName,
                password: password
            })
        );
    }

}