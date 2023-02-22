import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import * as SockIO from 'socket.io-client';

@Injectable({
    providedIn: "root"
})
export class    SocketService {

    private _socket: SockIO.Socket;
    private _room: string;
    private _username?: string; //Provisional

    constructor() {
        this._socket = SockIO.io("ws://localhost:3001");
        this._room = "Game1"; //Provisional
        this._socket.once("mockUser", (data: any) => {
            this._username = data.mockUser;
        }); //Provisional
    }

    get socket(): SockIO.Socket {
        return (this._socket);
    }

    get room(): string {
        return (this._room);
    }

    get username(): string | undefined {
        return (this._username);
    }

    emit<T>(event: string, data: T): void {
        this._socket.emit(event, data);
    }

    getObservable<T>(event: string): Observable<T> {
        return (
            new Observable<T>((subscriber) => {
                this._socket.on(event, (data: T) => {
                    subscriber.next(data);
                });
            })
        );
    }

}
