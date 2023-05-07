import {
    HttpClient,
    HttpErrorResponse
} from "@angular/common/http";
import { Injectable } from "@angular/core";
import {
    Observable,
    catchError,
    retry,
    switchMap,
    throwError
} from "rxjs";
import { UserDto } from "src/app/dtos/user.dto";

export interface    ICreateRoom {
    roomName: string;
    ownerId: number;
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

    getUser(username: string): Observable<UserDto[]> {
        return (
            this.httpService.get<UserDto[]>(
                `${this._urlAuthority}/users?filter[username]=${username}`
            ).pipe(
                retry(1),
                catchError(this._httpErrorHandler)
            )
        );
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

    postRoom(username: string, roomName: string, ownerId?: number,
                password?: string): Observable<IRoomData> {
        if (!ownerId)
        {
            return (this.getUser(username)
            .pipe(
                switchMap((users: UserDto[]) => {
                    if (!users)
                        throw new Error("User not found.");
                    return (this._postRoom({
                        roomName: roomName,
                        ownerId: users[0].id,
                        password: password
                    }));
                }),
                catchError((err) => {
                    return throwError(() => err);
                })
            ));
        }
        return (this._postRoom({
            roomName: roomName,
            ownerId: ownerId,
            password: password
        }));
    }

}
