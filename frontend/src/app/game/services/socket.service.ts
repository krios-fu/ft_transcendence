import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import * as SockIO from 'socket.io-client';
import { IAuthPayload } from 'src/app/interfaces/iauth-payload.interface';
import { AuthService } from 'src/app/services/auth.service';

enum SocketException {
    Unauthorized = "unauthorized",
    Forbidden = "forbidden"
}

interface   SocketExceptionData {
    cause: SocketException;
    data: any;
    targetEvent: string;
}

@Injectable({
    providedIn: "root"
})
export class    SocketService {

    private _socket: SockIO.Socket;
    private _authAttempts: number;
    private _authenticating: boolean;
    private _failedEvents: SocketExceptionData[];
    private _room: string;
    private _username?: string; //Provisional

    constructor(
        private readonly authService: AuthService
    ) {
        this._socket = SockIO.io("ws://localhost:3001");
        this._addConnectionEvents();
        this._authAttempts = 0;
        this._authenticating = false;
        this._failedEvents = [];
        this._room = "Game1"; //Provisional
        this._socket.once("mockUser", (data: any) => {
            this._username = data.mockUser;
        }); //Provisional
        //Authenticate through this event to register user in socket server
        this.emit("authentication", this.authService.getAuthToken());
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

    private _reconnect(): void {
        this._socket.connect();
        //Authenticate through this event to register user in socket server
        this.emit("authentication", this.authService.getAuthToken());
    }

    private _checkMaxAuthAttempts(): boolean {
        if (this._authAttempts < 3)
            return (false);
        this._authAttempts = 0;
        this._authenticating = false;
        this._socket.disconnect();
        this._reconnect();
        return (true);
    }

    /*
    **  Don't need to unsubscribe, as it returns just one value.
    **
    **  Not using handshake.auth because it cannot be modified after
    **  the initial assignment after connection. And don't want to disconnect
    **  the socket each time the token gets refreshed, as it would impact UX
    **  negatively.
    */
    private _authenticateConnection(): void {
        if (this._checkMaxAuthAttempts())
            return ;
        ++this._authAttempts;
        this.authService.directRefreshToken().subscribe(
            (payload: IAuthPayload | undefined) => {
                if (!payload)
                    return ;
                this.emit<string>("authentication", payload.accessToken);
            }
        );
    }

    private _emitFailedEvents(): void {
        this._failedEvents.forEach((event) => {
            this.emit(event.targetEvent, event.data);
        });
        this._failedEvents = [];
    }

    private _addConnectionEvents(): void {
        this._socket.on("exception", (xcpt: SocketExceptionData) => {
            console.log("Exception: ", xcpt);
            if (xcpt.cause === SocketException.Unauthorized)
            {
                if (xcpt.targetEvent != "authentication")
                    this._failedEvents.push(xcpt);
                if (this._authenticating)
                    return ;
                this._authenticating = true;
                this._authenticateConnection();
            }
        });
        this.socket.on("authSuccess", () => {
            this._authenticating = false;
            this._authAttempts = 0;
            this._emitFailedEvents();
        });
        this._socket.on("disconnect", () => {
            this._reconnect();
        });
    }

    joinRoom(roomId: string): void {
        if (!roomId || roomId === "")
            return ;
        this.emit<string>("joinRoom", roomId);
    }

    emit<T = undefined>(event: string, data?: T): void {
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
